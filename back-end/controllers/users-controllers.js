const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const signup = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    res.status(401).json({ message: 'Invalid input' });
    return;
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    res.json({ message: 'Signing up failed' });
    return;
  }

  if (existingUser) {
    res.status(403).json({ message: 'User already exists' });
    return;
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    res.json({ message: 'Hashing password failed' });
    return;
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (error) {
    res.json({ message: 'Saving new user failed' });
    return;
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (error) {
    res.json({ message: 'JWT sign failed (sign up)' });
    return;
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    res.json({ message: 'Loging in failed' });
    return;
  }

  if (!existingUser) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  let passwordIsValid = false;
  try {
    passwordIsValid = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    res.json({ message: 'Bcrypt compare failed' });
    return;
  }

  if (!passwordIsValid) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (error) {
    res.json({ message: 'Jwt sign failed (log in)' });
    return;
  }

  res
    .status(200)
    .json({ userId: existingUser.id, email: existingUser.email, token });
};

const getUserById = async (req, res) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(
      userId,
      '-password -createdAt -updatedAt -__v'
    ).exec();
  } catch (error) {
    res.json({ message: 'Finding user failed' });
    return;
  }

  if (!user) {
    res.status(404).json({ message: 'Could not find user' });
    return;
  }

  res.json({ user });
};

const updateProfile = async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.uid);
  } catch (error) {
    res.json({ message: 'Finding user failed (profile)' });
    return;
  }

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  user.name = req.body.name || user.name;

  if (req.body.email && req.body.email !== user.email) {
    let existingUser;
    const { email } = req.body;
    try {
      existingUser = await User.findOne({ email });
    } catch (error) {
      res.json({ message: "Updating user's email failed" });
      return;
    }

    if (existingUser) {
      res
        .status(403)
        .json({ message: 'A user with that email already exists' });
      return;
    }

    user.email = req.body.email;
  }

  if (req.body.password) {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(req.body.password, 12);
    } catch (error) {
      res.json({ message: 'Hashing password failed (update)' });
      return;
    }

    user.password = hashedPassword;
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
};

const getUsers = async (req, res) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    res.json({ message: 'Could not fetch users' });
    return;
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const deleteUser = async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.uid);
  } catch (error) {
    res.json({ message: 'Could not find that user by id' });
    return;
  }

  if (!user) {
    res.status(404).json({ message: 'Could not find user' });
    return;
  }

  try {
    await user.remove();
  } catch (error) {
    res.json({ message: 'Could not remove user' });
    return;
  }

  res.json({ message: 'User removed' });
};

const updateUser = async (req, res) => {
  const { name, email, isAdmin } = req.body;

  let updatedUser;
  try {
    updatedUser = await User.findById(req.params.uid);
  } catch (error) {
    res.json({ message: 'Could not find user' });
    return;
  }

  if (!updatedUser) {
    res.status(404).json({ message: 'User not found (updateUser)' });
    return;
  }

  if (name !== updatedUser.name) updatedUser.name = name;

  if (email !== updatedUser.email) {
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (error) {
      res.json({ message: "Updating user's email failed" });
      return;
    }

    if (existingUser) {
      res
        .status(403)
        .json({ message: 'A user with that email already exists' });
      return;
    }
    updatedUser.email = email;
  }

  if (isAdmin !== updatedUser.isAdmin) updatedUser.isAdmin = isAdmin;

  try {
    await updatedUser.save();
  } catch (error) {
    res.json({ message: 'Could not save updated user' });
    return;
  }

  res.status(200).json(updatedUser);
};

exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
exports.updateProfile = updateProfile;
exports.getUsers = getUsers;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
