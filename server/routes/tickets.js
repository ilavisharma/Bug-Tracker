const router = require('express').Router();
const multer = require('multer');
const db = require('../utils/db');
const { uploadImage } = require('../utils/helpers');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/new', async (req, res) => {
  try {
    const query = await db('tickets').insert({
      dateAdded: db.fn.now(),
      ...req.body
    });
    res.json({ id: query[0] }).status(201);
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
