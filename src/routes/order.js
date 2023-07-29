const {Router} = require('express');

const {authenticate , checkRole} = require('../middlewares/auth');

const order = Router();

const { 
        checkoutOrder ,
        payment,
        getAllOrders,
        getOlderByuserId,
        cancelOrder,
        adminChangeStatus
} =  require('../controllers/order');


order.route('/order/checkout')
    .post(
        authenticate,
        checkoutOrder
    );

order.route('/order/payment')
    .post(
        authenticate,
        payment
    );

order.route('/orders')
    .get(
        authenticate,
        checkRole("admin"),
        getAllOrders
    );

order.route('/order')
    .get(
        authenticate,
        getOlderByuserId
    );

order.route('/order/cancel')
    .post(
        authenticate,
        cancelOrder
    );

order.route('/order/changestatus')
    .post(
        authenticate,
        checkRole("admin"),
        adminChangeStatus
    );

module.exports = order ;