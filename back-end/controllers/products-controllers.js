const Product = require('../models/product');
const { uploadFile, deleteFile } = require('../middleware/s3-client');

const createProduct = async (req, res) => {
  const { user, name, brand, price, category, stock, description } = req.body;

  let uploadedImage;
  try {
    uploadedImage = await uploadFile(req.file);
  } catch (error) {
    res.json({ message: 'Uploading product image failed' });
    return;
  }

  const createdProduct = new Product({
    user,
    name,
    brand,
    price,
    category,
    stock,
    image: uploadedImage.Location,
    description,
  });

  try {
    await createdProduct.save();
  } catch (error) {
    res.status(409).json({ message: 'Saving new product failed' });
    return;
  }

  res.status(201).json(createdProduct);
};

const getProducts = async (req, res) => {
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const size = 6;
  const page = Number(req.query.pageNum) || 1;

  let products;
  try {
    products = await Product.find({ ...keyword })
      .limit(size)
      .skip(size * (page - 1));
  } catch (error) {
    res.status.json({ message: 'Could not find products' });
    return;
  }

  let count;
  try {
    count = await Product.countDocuments({ ...keyword });
  } catch (error) {
    res.json({ message: 'countDocuments failed' });
    return;
  }

  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
    page,
    pages: Math.ceil(count / size),
  });
};

const getProductById = async (req, res) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    res.json({ message: 'Failed to get product by id' });
    return;
  }

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const deleteProduct = async (req, res) => {
  let product;
  try {
    product = await Product.findById(req.params.pid);
  } catch (error) {
    res.json({ message: 'Could not find the product' });
    return;
  }

  if (!product) {
    res.status(404).json({ message: 'Could not find a product with that id' });
    return;
  }

  try {
    await deleteFile(product.image.substring(51));
  } catch (error) {
    res.json({ message: 'Could not delete image' });
    return;
  }

  try {
    await product.remove();
  } catch (error) {
    res.json({ message: 'Could not delete product' });
    return;
  }

  res.json({ message: 'Product deleted' });
};

const updateProduct = async (req, res) => {
  const { name, brand, price, category, stock, description } = req.body;

  let updatedProduct;
  try {
    updatedProduct = await Product.findById(req.params.pid);
  } catch (error) {
    res.json({ message: 'Could not find product (update)' });
    return;
  }

  if (!updatedProduct) {
    res.status(404).json({ message: 'Product not found (update)' });
    return;
  }

  updatedProduct.name = name;
  updatedProduct.brand = brand;
  updatedProduct.price = price;
  updatedProduct.category = category;
  updatedProduct.stock = stock;
  updatedProduct.description = description;

  if (req.file && req.file.path) {
    let uploadedImage;
    try {
      uploadedImage = await uploadFile(req.file);
    } catch (error) {
      res.json({ message: 'Uploading product image failed' });
      return;
    }

    updatedProduct.image = uploadedImage.Location;
  }

  try {
    await updatedProduct.save();
  } catch (error) {
    res.json({ message: 'Could not save updated product' });
    return;
  }

  res.status(200).json(updatedProduct);
};

const createReview = async (req, res) => {
  const { rating, comment } = req.body;

  let product;
  try {
    product = await Product.findById(req.params.pid);
  } catch (error) {
    res.json({ message: 'Could not find product (create review)' });
    return;
  }

  if (!product) {
    res.status(404).json({ message: 'Product not found (create review)' });
    return;
  }

  const reviewExists = product.reviews.find(
    (review) => review.userId.toString() === req.user._id.toString()
  );

  if (reviewExists) {
    res.status(400).json({ message: 'You already reviewed this product' });
    return;
  }

  const review = {
    name: req.user.name,
    rating: rating,
    comment,
    userId: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((total, review) => review.rating + total, 0) /
    product.reviews.length;

  try {
    await product.save();
  } catch (error) {
    res.json({ message: 'Could not save review' });
    return;
  }

  res.status(201).json({ message: 'Review saved' });
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.deleteProduct = deleteProduct;
exports.updateProduct = updateProduct;
exports.createReview = createReview;
