const mongoose = require('mongoose');

const checkUserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String,required: true,unique: true,
        lowercase: true,match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    phone: {type:String ,required: true,match: /^01\d{9}$/},
    password: {type: String,required: true,minlength: 8},
    otp: {type: String,required: true},
    createdAt: {type: Date, default: Date.now, expires: '1h', 
    },
});


const CheckEmail = mongoose.model('checkEmail' , checkUserSchema);

module.exports = CheckEmail