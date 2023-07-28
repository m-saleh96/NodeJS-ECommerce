const mongoose = require('mongoose');

const forgetPasswordSchema = new mongoose.Schema({
    email: {type: String,required: true,unique: true,
        lowercase: true,match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    userId: {type: String,required: true},
    otp: {type: String,required: true},
    createdAt: {type: Date, default: Date.now, expires: '1h', 
    },
});


const ForgetPassword = mongoose.model('forgetpassword' , forgetPasswordSchema);

module.exports = ForgetPassword