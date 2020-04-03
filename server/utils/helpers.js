const admin = require('firebase-admin');
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
    const { originalname, buffer, mimetype, encoding } = file;

    const blob = bucket.file(Date.now() + originalname.replace(/ /g, '_'));

    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
      metadata: { mimetype, encoding }
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

module.exports = { uploadImage };
