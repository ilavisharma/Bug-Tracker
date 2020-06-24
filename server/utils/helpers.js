const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { cloudinaryConfig, jwtSecret } = require('./config');

cloudinary.config(cloudinaryConfig);

const uploadImage = (file, source, transformation = null) =>
  new Promise((resolve, reject) => {
    const { buffer } = file;
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: source,
        unique_filename: true,
        transformation,
      },
      (error, result) => {
        if (error) reject(error);
        else {
          console.log(result);
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });

const signToken = (data, expiresIn = '1d') =>
  jwt.sign(data, jwtSecret, {
    expiresIn,
  });

const verifyToken = token => jwt.verify(token, jwtSecret);

const randomPassword = (length = 12) => {
  var chars =
    'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
  var pass = '';
  for (var x = 0; x < length; x++) {
    var i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }
  return pass;
};

const extractName = url => {
  if (url) {
    var m = url.toString().match(/.*\/(.+?)\./);
    if (m && m.length > 1) {
      return m[1];
    }
  }
  return '';
};

const deleteImage = async (link, folder) => {
  if (link === '' || link === '/defaultUser.png') return;
  const id = extractName(link);
  const { result } = await cloudinary.uploader
    .destroy(folder + '/' + id)
    .catch(console.log);
  if (result !== 'ok') console.log(result);
};

const deleteMultipleImages = async (links, folder) => {
  links.forEach(async l => {
    const id = extractName(l);
    const { result } = await cloudinary.uploader
      .destroy(folder + '/' + id)
      .catch(console.log);
    if (result !== 'ok') console.log(result);
  });
};

module.exports = {
  uploadImage,
  signToken,
  verifyToken,
  randomPassword,
  deleteImage,
  deleteMultipleImages,
};
