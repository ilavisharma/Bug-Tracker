const router = require('express').Router();
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const { signToken } = require('../utils/helpers');

router.get('/currentUser', ({ currentUser }, res) => {
  if (currentUser) {
    const { id, name, email } = currentUser;
    res.json({ id, name, email });
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
      token: signToken(foundUser),
      user: foundUser
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  const newUser = {
    name,
    email,
    password: bcrypt.hashSync(password, 10)
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
