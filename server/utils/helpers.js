const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { cloudinaryConfig } = require('./config');

cloudinary.config(cloudinaryConfig);

const uploadImage = (file, source, transformation = null) =>
  new Promise((resolve, reject) => {
    const { buffer } = file;
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: source,
        unique_filename: true,
        transformation
      },
      (error, result) => {
        if (error) reject(error);
        else {
          resolve(result.url);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });

const signToken = user =>
  jwt.sign(user, 'rpmgetingear', {
    expiresIn: '1d'
  });

const verifyToken = token => jwt.verify(token, 'rpmgetingear');

module.exports = { uploadImage, signToken, verifyToken };
