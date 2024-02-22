const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    req.user = { userId: decodedToken.userId };
    console.log(req.user);
    next();
  } catch (err) {
    const error = new HttpError('Authentication failed!!!!', 403);
    console.log(error);
    return next(error);
  }
};
