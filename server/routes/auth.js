const router = require('express').Router();
const db = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPassword = async password => {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (err) {
    throw new Error(err);
  }
};

router.post('/currentUser', async (req, res) => {
  const user = jwt.decode(req.body.token);
  res.json({ token: jwt.sign(user, 'rpmgetingear'), user });
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    // fetch the user
    const query = await db('users')
      .select('*')
      .where({ email });
    if (query.length === 0) {
      return res.sendStatus(204);
    }
    // user found
    const foundUser = {
      id: query[0].id,
      email: query[0].email,
      name: query[0].name
    };
    // check password
    const isCorrectPassword = await bcrypt.compare(password, query[0].password);
    if (!isCorrectPassword) {
      return res.sendStatus(401);
    }
    // console.log(foundUser);
    res.json({
      token: jwt.sign(foundUser, 'rpmgetingear'),
      user: foundUser
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = {
    name,
    email,
    password: await hashPassword(password)
  };

  try {
    db('users')
      .insert(newUser)
      .then(() => {
        res.sendStatus(201);
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
