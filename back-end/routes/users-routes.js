const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/auth');
const checkAuthAdmin = require('../middleware/admin-auth');

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  usersControllers.signup
);
router.post('/login', usersControllers.login);

router.use(checkAuth);
router.get('/:uid', usersControllers.getUserById);
router.put('/profile/:uid', usersControllers.updateProfile);

router.use(checkAuthAdmin);
router.get('/', usersControllers.getUsers);
router.delete('/:uid', usersControllers.deleteUser);
router.put('/:uid', usersControllers.updateUser);

module.exports = router;
