const router = require('express').Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const { v4: uuid } = require('uuid');
const db = require('../utils/db');
const { uploadImage } = require('../utils/helpers');
const { signToken } = require('../utils/helpers');

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
  const { name, email, password, photourl } = req.body;
  if (photourl === null) {
    photourl = '/defaultUser.png';
  }
  const newUser = {
    id: uuid(),
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
    res.json({ id: insertQuery[0] });
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
  try {
    await db('roles')
      .where({ user_id: id })
      .update({ role })
      .returning('*');
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/uploadImage', upload.single('file'), async (req, res) => {
  try {
    const url = await uploadImage(req.file, 'users');
    res.json({ url });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
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
