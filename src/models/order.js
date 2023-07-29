const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId , ref :'user', required: true},
    name: { type : String, required: true},
    phone: { type : String, required: true},
    address: { type : String, required: true},
    totalPrice: { type : String, required: true},
    status: {
        type: String,
        enum: ["processing", "out for deliver", "delivered", "rejected"],
        required: true,
        default: "processing"
    },
    subscription: { type : Object , required: true},
    orders: [
        {
            _id: false,
            productId : { type: mongoose.Types.ObjectId , ref :'product', required: true},
            quantity:{ type : Number , required: true}
        }
    ]
});


const Order = mongoose.model('order' , orderSchema);

module.exports = Order;