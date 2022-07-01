const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const usersRoutes = require('./routes/users-routes');
const productsRoutes = require('./routes/products-routes');
const ordersRoutes = require('./routes/orders-routes');

const app = express();
app.use(express.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  next();
});

app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_ID));

app.use((req, res, next) => {
  res.status(404).json({ message: 'Could not find this route' });
  return;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) return next(error);
  res.json({ message: error.message || 'An unknown error has occurred' });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4vze0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => app.listen(process.env.PORT || 5000))
  .catch((err) => console.log(err));
