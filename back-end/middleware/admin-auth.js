const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  if (req.user && req.user.isAdmin) next();
  else {
    res.status(401).json({ message: 'Unauthorized, not an administrator' });
    return;
  }
};
