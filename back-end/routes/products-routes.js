const express = require('express');
const checkAuth = require('../middleware/auth');
const checkAuthAdmin = require('../middleware/admin-auth');
const fileUpload = require('../middleware/file-upload');

const productsControllers = require('../controllers/products-controllers');

const router = express.Router();

router.get('/', productsControllers.getProducts);
router.get('/:pid', productsControllers.getProductById);

router.use(checkAuth);
router.post('/:pid/reviews', productsControllers.createReview);
router.use(checkAuthAdmin);
router.post('/', fileUpload.single('image'), productsControllers.createProduct);
router.delete('/:pid', productsControllers.deleteProduct);
router.put(
  '/:pid',
  fileUpload.single('image'),
  productsControllers.updateProduct
);

module.exports = router;
