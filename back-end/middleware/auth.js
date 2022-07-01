const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw new Error('Authentication failed. (token)');

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.user = await User.findById(decodedToken.userId).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized, token failed' });
    return;
  }
};
