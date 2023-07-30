const TempOrder = require('../models/tempOrder');

const Order = require('../models/order');

const nodeMailer = require('nodemailer');

const stripe = require('stripe')('sk_test_51NZQKlHsTIHjd4e44M45a0Tfc4s8Wg2h0JLHoxSMrFEaW7SrhikQYSuFOPTqsxGVdNJYyKaXPFwp6pj7tbtqngos00uG90O7XG');

const checkoutOrder = async(req , res ,next) =>{
    try {
        if (req.userId && req.body.orders) {
            const order = await TempOrder.create({ ...req.body, userId : req.userId });

            const {orders} = await TempOrder.findOne({ userId : req.userId }).populate("orders.productId");

            if (!orders[0].productId) {
                await TempOrder.deleteMany({userId :req.userId })
                return res.status(422).json({
                    message:"product in order not found"
                });
            }

            let totalPrice = 0;
            orders.forEach(elm =>{
                totalPrice = totalPrice + (elm.quantity * elm.productId.price);
            })

            return  res.status(201).json({
                message :"success now payment",
                totalPrice:totalPrice     
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
            const checkOrder = await TempOrder.findOne({ userId : req.userId });

            if (!checkOrder) {
                return res.status(404).json({
                    message :"order not found" ,
                });
            }
            
            const {orders} = await TempOrder.findOne({ userId : req.userId }).populate("orders.productId");

            if (!orders[0].productId) {
                await TempOrder.deleteMany({userId :req.userId })
                return res.status(422).json({
                    message:"product in order not found"
                });
            }

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

            const transporter = nodeMailer.createTransport({
                service: 'gmail',
                host:'smtp.gmail.com',
                auth: {
                    user: 'mohamedsaleh1881996@gmail.com', 
                    pass: "xikfgsobpbgatloc", 
                },
            });
    
            const info = await transporter.sendMail({
                from: 'MohamedSaleh1881996@gmail.com', // sender address
                to: req.email, // list of receivers
                subject: "Order request success", // Subject line
                text: ` 
                        your order details
                        Order ID : ${order._id}
                        Address  : ${order.address}
                        Total Price  : ${order.totalPrice}
                        ` 
            });

            return res.status(201).json({
                message: "order created successfully please check your email",
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

const adminChangeStatus = async(req , res ,next) =>{
    try {
        const {orderId , status} = req.body;

        if (status === "out for deliver" || status === "delivered" || status === "rejected") {
            const order = await Order.findByIdAndUpdate(orderId , {status});
            if (order) {
                return  res.status(201).json({
                message :"status updated successfully"
            });
            } else {
                return  res.status(422).json({
                    message :"order not found"
                });
            }
        } else {
            return  res.status(422).json({
                message :"please check status value"
            });
        }

    } catch (error) {
        next(error);
    }
}

const cancelOrder = async(req , res ,next) =>{
    try {
        const {orderId} = req.body;
        const order= await Order.find({_id:orderId})
        
        if (order[0]?.userId.toString() === req.userId && order[0]?.status === "processing") {
            await Order.deleteOne({_id:orderId , userId:req.userId});
            return  res.status(201).json({
                message :"canceled successfully"
            });
        } else {
            return  res.status(422).json({
                message :"failed not owner or it's out for deliver"
            });
        }

    } catch (error) {
        next(error);
    }
}

module.exports = {checkoutOrder , payment , getAllOrders , getOlderByuserId , adminChangeStatus , cancelOrder}