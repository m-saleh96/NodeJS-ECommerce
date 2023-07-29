const mongoose = require('mongoose');

const tempOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId , ref :'user', required: true},
    orders: [
        {
            _id: false,
            productId : { type: mongoose.Types.ObjectId , ref :'product', required: true},
            quantity:{ type : Number , required: true}
        }
    ],
    createdAt: {type: Date, default: Date.now, expires: '1h', 
    },
});


const TempOrder = mongoose.model('tempOrder' , tempOrderSchema);

module.exports = TempOrder;