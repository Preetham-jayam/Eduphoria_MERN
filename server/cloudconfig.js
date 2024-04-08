const cloudinary = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    upload_preset:'eduphoria'
});

module.exports = cloudinary;