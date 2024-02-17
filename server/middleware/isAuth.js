const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authentication failed: Token missing or invalid!');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed: Token missing!');
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    req.user = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    const error = new HttpError('Authentication failed!', 403);
    return next(error);
  }
};
