const multer = require('multer');
const { v1: uuidv1 } = require('uuid');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
};

const fileUpload = multer({
  limits: {
    fileSize: 50000000, 
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const isImage = file.mimetype.startsWith('image/');
      const subfolder = isImage ? 'images' : 'videos';
      cb(null, `uploads/${subfolder}`);
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv1() + '.' + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  },
});

module.exports = fileUpload;
