const router = require('express').Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const db = require('../utils/db');
const { uploadImage, signToken, randomPassword } = require('../utils/helpers');
const { sendWelcomeMail, sendRoleChange } = require('../utils/sendGrid');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/currentUser', ({ currentUser }, res) => {
  if (currentUser) {
    const { id, name, email, photourl, role } = currentUser;
    res.json({ id, name, email, photourl, role });
  } else {
    res.sendStatus(204);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    // fetch the user
    const query = await db('users')
      .select('*')
      .innerJoin('roles', 'users.id', 'roles.user_id')
      .where({ email });
    if (query.length === 0) {
      return res.sendStatus(204);
    }
    // user found
    const foundUser = {
      id: query[0].id,
      email: query[0].email,
      name: query[0].name,
      photourl: query[0].photourl
    };
    // check password
    const isCorrectPassword = await bcrypt.compare(password, query[0].password);
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
      role
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
    photourl
  };

  try {
    const insertQuery = await db('users')
      .insert(newUser)
      .returning('id');
    await db('roles').insert({
      user_id: insertQuery[0],
      role: null
    });
    res.json({ message: 'user created', user: { id: insertQuery[0] } });
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
    const query = await db('users')
      .select('*')
      .innerJoin('roles', 'users.id', 'roles.user_id')
      .where({ id });
    if (query[0].role === 'manager') {
      // fetch from managers table projects assigned to this user
      const managerQuery = await db('project_managers')
        .select('id', 'name')
        .innerJoin('projects', 'project_managers.project_id', 'projects.id')
        .where({ manager_id: id });
      res.json({
        ...query[0],
        password: undefined,
        user_id: undefined,
        projects: managerQuery
      });
    } else if (query[0].role === 'developer') {
      const managerQuery = await db('project_developers')
        .select('id', 'name')
        .innerJoin('projects', 'project_developers.project_id', 'projects.id')
        .where({ developer_id: id });
      res.json({
        ...query[0],
        password: undefined,
        user_id: undefined,
        projects: managerQuery
      });
    } else {
      res.json({
        ...query[0],
        password: undefined,
        user_id: undefined,
        projects: []
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
    currentUser: { name: changer }
  } = req;
  try {
    await db('roles')
      .where({ user_id: id })
      .update({ role });
    res.sendStatus(200);
    db('users')
      .select('name', 'email')
      .where({ id })
      .then(result => {
        const [{ name, email }] = result;
        sendRoleChange(email, name, role, changer);
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put('/updatePassword', async (req, res) => {
  const {
    currentUser: { id }
  } = req;
  const { prevPassword, newPassword } = req.body;
  try {
    const passwordQuery = await db('users')
      .select('password')
      .where({ id });
    const isPasswordValid = await bcrypt.compare(
      prevPassword,
      passwordQuery[0].password
    );
    if (isPasswordValid) {
      await db('users')
        .update({ password: bcrypt.hashSync(newPassword, 10) })
        .where({ id });
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } else {
      res.json({
        success: false,
        message: 'Incorrect Password'
      });
    }
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
      gravity: 'face:auto'
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
    .delete();
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
