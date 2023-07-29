const {Router} = require('express');

const {authenticate , checkRole} = require('../middlewares/auth');

const order = Router();

const { 
        checkoutOrder ,
        payment,
        getAllOrders,
        getOlderByuserId
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

module.exports = order ;