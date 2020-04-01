const router = require('express').Router();
const multer = require('multer');
const admin = require('firebase-admin');
const db = require('../utils/db');
const serviceAccount = require('../firebase/adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bugtrackerfire.firebaseio.com'
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images');
  },
  filename: function(req, file, cb) {
    cb(null, '' + Date.now() + '.' + file.originalname.split('.')[1]);
  }
});

const upload = multer({ storage });

router.post('/new', async (req, res) => {
  const {} = req.body;
  try {
    const query = await db('tickets').insert();
    res.json({ id: query[0] }).status(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/uploadImage', upload.single('file'), async (req, res) => {
  const { path } = req.file;
  const bucketName = 'bugtrackerfire.appspot.com';
  const bucket = admin.storage().bucket(`gs://${bucketName}/`);

  try {
    const result = await bucket.upload(path, { gzip: true, resumable: false });
    res
      .json({
        url: `https://storage.googleapis.com/${bucketName}/` + result[0].name
      })
      .status(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
