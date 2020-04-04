const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const serviceAccount = require('../firebase/adminsdk.json');
const { firebaseDatabaseURL } = require('./config');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseDatabaseURL
});

const bucketName = 'bugtrackerfire.appspot.com';
const bucket = admin.storage().bucket(`gs://${bucketName}/`);

const uploadImage = file =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = bucket.file(Date.now() + '.' + originalname.split('.')[1]);

    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true
    });
    blobStream
      .on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on('error', () => {
        reject('Unable to upload image, something went wrong');
      })
      .end(buffer);
  });

const signToken = user =>
  jwt.sign(user, 'rpmgetingear', {
    expiresIn: '1d'
  });

const verifyToken = token => jwt.verify(token, 'rpmgetingear');

module.exports = { uploadImage, signToken, verifyToken };
