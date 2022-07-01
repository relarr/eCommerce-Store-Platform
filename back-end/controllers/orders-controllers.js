const Order = require('../models/order');

const addNewOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsAmount,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No orders' });
    return;
  }

  const createdOrder = new Order({
    userId: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsAmount,
    taxAmount,
    shippingAmount,
    totalAmount,
  });

  try {
    await createdOrder.save();
  } catch (error) {
    res.json({ message: 'Could not save order' });
    return;
  }

  res.status(201).json(createdOrder);
};

const getOrderById = async (req, res) => {
  let order;
  try {
    order = await Order.findById(req.params.oid).populate(
      'userId',
      'name email'
    );
  } catch (error) {
    res.status(404).json({ message: 'Could not find order' });
    return;
  }

  res.json(order);
};

const updatePaidOrder = async (req, res) => {
  let order;
  try {
    order = await Order.findById(req.params.oid);
  } catch (error) {
    res.status(404).json({ message: 'Could not find order (update)' });
    return;
  }

  if (!order) {
    res.status(404).json({ message: 'Could not find a product with that id' });
    return;
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  };

  const paidOrder = await order.save();
  res.json(paidOrder);
};

const getUserOrders = async (req, res) => {
  let userOrders;
  try {
    userOrders = await Order.find({ userId: req.user._id });
  } catch (error) {
    res.json({ message: "Could not find user's orders" });
    return;
  }
  res.json(userOrders);
};

const getAllOrders = async (req, res) => {
  let orders;
  try {
    orders = await Order.find({}).populate('userId', 'id, name');
  } catch (error) {
    res.json({ message: 'Could not find orders' });
    return;
  }

  res.json(orders);
};

const updateToOrderIsDelivered = async (req, res) => {
  let order;
  try {
    order = await Order.findById(req.params.oid);
  } catch (error) {
    res.json({ message: 'Could not find order (update deliver)' });
    return;
  }

  if (!order) {
    res.status(404).json({ message: 'Order not found (update deliver)' });
    return;
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  let updatedOrder;
  try {
    updatedOrder = await order.save();
  } catch (error) {
    res.json({ message: 'Could not save updated order (deliver)' });
    return;
  }

  res.json(updatedOrder);
};

exports.addNewOrder = addNewOrder;
exports.getOrderById = getOrderById;
exports.updatePaidOrder = updatePaidOrder;
exports.getUserOrders = getUserOrders;
exports.getAllOrders = getAllOrders;
exports.updateToOrderIsDelivered = updateToOrderIsDelivered;
