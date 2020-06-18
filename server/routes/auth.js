const router = require('express').Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const db = require('../utils/db');
const {
  uploadImage,
  signToken,
  randomPassword,
  verifyToken,
} = require('../utils/helpers');
const {
  sendWelcomeMail,
  sendRoleChange,
  sendForgotPassword,
} = require('../utils/sendGrid');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/currentUser', async ({ currentUser }, res) => {
  if (currentUser) {
    const { id } = currentUser;
    const userQuery = await db('users').select('*').where({ id });
    if (userQuery.length === 0) return res.sendStatus(204);
    const foundUser = {
      ...userQuery[0],
      password: undefined,
    };
    const roleQuery = await db('roles')
      .select('role')
      .where({ user_id: foundUser.id });
    const { role } = roleQuery[0];
    res
      .json({
        token: signToken({ role, ...foundUser }),
        user: { ...foundUser, role },
      })
      .status(200);
  } else {
    res.sendStatus(204);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    // fetch the user
    const [user] = await db('users')
      .select('*')
      .innerJoin('roles', 'users.id', 'roles.user_id')
      .where({ email });
    if (!user) {
      return res.sendStatus(204);
    }
    // user found
    const foundUser = {
      ...user,
      password: undefined,
    };
    // check password
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.sendStatus(401);
    }
    // get the user role
    const roleQuery = await db('roles')
      .select('role')
      .where({ user_id: foundUser.id });
    const { role } = roleQuery[0];
    res.json({
      token: signToken({ role, ...foundUser }),
      user: foundUser,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/signup', async (req, res) => {
  let { name, email, photourl } = req.body;
  if (photourl === null) {
    photourl = '/defaultUser.png';
  }
  const password = randomPassword();
  const newUser = {
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    photourl,
  };

  try {
    const [id] = await db('users').insert(newUser).returning('id');
    await db('roles').insert({
      user_id: id,
      role: null,
    });
    res.json({ message: 'user created', user: { id } });
    sendWelcomeMail(email, password).catch(e => console.log(JSON.stringify(e)));
  } catch (err) {
    if (err.code === '23505') {
      res.json({ message: 'user already exists', user: null });
    } else {
      console.log(err);
      res.sendStatus(500);
    }
  }
});

router.post('/forgotPassword', async (req, res) => {
  const { origin } = req.headers;
  const { email } = req.body;
  try {
    const [user] = await db('users')
      .select('name', 'email', 'id')
      .where({ email });
    if (!user) {
      return res.json({ status: false });
    }
    const token = signToken(user);
    const forgotLink = `${origin}/resetPassword?token=${token}`;
    await sendForgotPassword(email, forgotLink, user.name);
    res.json({ status: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/resetPassword', async (req, res) => {
  const { password, token } = req.body;
  try {
    const { id } = verifyToken(token);
    await db('users')
      .update({ password: bcrypt.hashSync(password, 10) })
      .where({ id })
      .then(() => res.json({ success: true }))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Invalid Token' }).status(406);
  }
});

router.put('/updateProfile', async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.currentUser;
  try {
    await db('users')
      .update({ name, email })
      .where({ id })
      .catch(err => {
        console.log(err);
        res.sendStatus(204);
      });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/allUsers', async ({ currentUser }, res) => {
  if (currentUser.role === 'admin') {
    try {
      const query = await db('users')
        .select('id', 'name', 'email', 'role')
        .innerJoin('roles', 'users.id', 'roles.user_id');
      res.json(query);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(401);
  }
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db('users')
      .select('*')
      .innerJoin('roles', 'users.id', 'roles.user_id')
      .where({ id });
    if (user.role === 'manager') {
      // fetch from managers table projects assigned to this user
      const managerQuery = await db('project_managers')
        .select('id', 'name')
        .innerJoin('projects', 'project_managers.project_id', 'projects.id')
        .where({ manager_id: id });
      res.json({
        ...user,
        password: undefined,
        user_id: undefined,
        projects: managerQuery,
      });
    } else if (user.role === 'developer') {
      const managerQuery = await db('project_developers')
        .select('id', 'name')
        .innerJoin('projects', 'project_developers.project_id', 'projects.id')
        .where({ developer_id: id });
      res.json({
        ...user,
        password: undefined,
        user_id: undefined,
        projects: managerQuery,
      });
    } else {
      res.json({
        ...user,
        password: undefined,
        user_id: undefined,
        projects: [],
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put('/updateRole', async (req, res) => {
  const { id, role } = req.body;
  const {
    currentUser: { name: changer },
  } = req;
  await db('roles')
    .where({ user_id: id })
    .update({ role })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  res.sendStatus(200);
  const [{ name, email }] = await db('users')
    .select('name', 'email')
    .where({ id })
    .catch(err => console.log(err));
  sendRoleChange(email, name, role, changer);
});

router.put('/updatePassword', async (req, res) => {
  const {
    currentUser: { id },
  } = req;
  const { prevPassword, newPassword } = req.body;
  try {
    const [{ password }] = await db('users').select('password').where({ id });
    const isPasswordValid = await bcrypt.compare(prevPassword, password);
    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: 'Incorrect Password',
      });
    }
    await db('users')
      .update({ password: bcrypt.hashSync(newPassword, 10) })
      .where({ id });
    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/uploadImage', upload.single('file'), async (req, res) => {
  try {
    const url = await uploadImage(req.file, 'users', {
      width: 250,
      height: 250,
      crop: 'fill',
      gravity: 'face:auto',
    });
    res.json({ url });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db('users')
    .where({ id })
    .delete()
    .catch(err => {
      console.log(err);
      return res.sendStatus(500);
    });
  res.sendStatus(200);
});

router.get('/allManagers', async (req, res) => {
  const { currentUser } = req;
  if (currentUser.role === 'admin' || currentUser.role === 'manager') {
    try {
      const query = await db('users')
        .select('id', 'name', 'email')
        .innerJoin('roles', 'users.id', 'roles.user_id')
        .where({ role: 'manager' });
      res.json(query);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
