const router = require('express').Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const db = require('../utils/db');
const { uploadImage } = require('../utils/helpers');
const { signToken } = require('../utils/helpers');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/currentUser', ({ currentUser }, res) => {
  if (currentUser) {
    const { id, name, email, photourl } = currentUser;
    res.json({ id, name, email, photourl });
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
      name: query[0].name,
      photourl: query[0].photourl
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

router.post('/signup', async (req, res) => {
  const { name, email, password, photourl } = req.body;
  if (photourl === null) {
    photourl = '/defaultUser.png';
  }
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
    console.log(insertQuery);
    await db('roles').insert({
      user_id: insertQuery[0],
      role: null
    });
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/uploadImage', upload.single('file'), async (req, res) => {
  try {
    const url = await uploadImage(req.file);
    res.json({ url });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
