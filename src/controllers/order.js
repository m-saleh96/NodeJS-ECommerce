const TempOrder = require('../models/tempOrder');

const Order = require('../models/order');


const stripe = require('stripe')('sk_test_51NYyMgJaDmXk2hdyC9wIv1kARWohqBFqVT43VN0pavRxw8c5HiEGN1pOzUcPnCzXqVrvTTHAntSoDEYSIcq3iwFH00tZiyb2bh');

const checkoutOrder = async(req , res ,next) =>{
    try {
        if (req.userId && req.body.orders) {
            const {order} = await TempOrder.create({ ...req.body, userId : req.userId });
            return  res.status(201).json({
                message :"order created successfully" ,
                order :order
            });

        } else{
            res.status(404).json({
                message :"User not found or no orders added" ,
            });
        }

    } catch (error) {
        next(error);
    }
}

const payment = async(req , res ,next) =>{
    try {
        if (req.userId) {
            const {orders} = await TempOrder.findOne({ userId : req.userId }).populate("orders.productId");
            let totalPrice = 0;
            orders.forEach(elm =>{
                totalPrice = totalPrice + (elm.quantity * elm.productId.price);
            })

            const product = await stripe.products.create({
                name: req.body.name,
                description: '$12/Month subscription',
            });
            
            const price = await stripe.prices.create({
                unit_amount: 1200,
                currency: 'usd',
                recurring: {
                    interval: 'month',
                },
                product: product.id,
            });

            const subscription = {
                productId: product.id,
                priceId: price.id,
            };

            const order = await Order.create({...req.body , userId:req.userId , orders , totalPrice , subscription});

            await TempOrder.deleteOne({userId : req.userId});

            return res.status(201).json({
                message: "payment done successfully ",
                data:{name:order.name , phone:order.phone , address:order.address , totalPrice:order.totalPrice}
            })

        } else{
            res.status(404).json({
                message :"order not found" ,
            });
        }

    } catch (error) {
        next(error);
    }
}

const getAllOrders = async(req , res ,next) =>{
    try {
        const order = await Order.find().populate('orders.productId');
        return  res.status(201).json({
            message :"success" ,
            order :order
        });

    } catch (error) {
        next(error);
    }
}

const getOlderByuserId = async(req , res ,next) =>{
    try {
        const order = await Order.find({userId:req.userId}).populate('orders.productId');
        return  res.status(201).json({
            message :"success" ,
            order :order
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {checkoutOrder , payment , getAllOrders , getOlderByuserId}