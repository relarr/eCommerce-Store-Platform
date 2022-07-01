const express = require('express');
const checkAuth = require('../middleware/auth');
const checkAuthAdmin = require('../middleware/admin-auth');
const ordersControllers = require('../controllers/orders-controllers');

const router = express.Router();

router.use(checkAuth);
router.post('/', ordersControllers.addNewOrder);
router.get('/userorders', ordersControllers.getUserOrders);
router.get('/:oid', ordersControllers.getOrderById);
router.put('/:oid/pay', ordersControllers.updatePaidOrder);
router.use(checkAuthAdmin);
router.get('/', ordersControllers.getAllOrders);
router.put('/:oid/delivered', ordersControllers.updateToOrderIsDelivered);

module.exports = router;
