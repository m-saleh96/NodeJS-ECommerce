const { User } = require('../models/user');

const CheckEmail  = require('../models/checkemail');

const nodeMailer = require('nodemailer');

const randomstring = require('randomstring'); // to generate random string

const { validationResult } = require('express-validator');

const createUser = async (req , res , next) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
    
            return res.status(400).json({ errors: errorMessages });
        }

        const verificationCode = randomstring.generate({
            length: 6,
            charset: 'numeric', // Set it to 'alphanumeric' for alphanumeric codes
        });
    
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            host:'smtp.gmail.com',
            auth: {
                user: 'mohamedsaleh1881996@gmail.com', 
                pass: "xikfgsobpbgatloc", //Mm123456789
            },
        });

        const info = await transporter.sendMail({
            from: 'MohamedSaleh1881996@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: "verify email", // Subject line
            text: verificationCode // plain text body
        });

        await CheckEmail.create({...req.body, otp : verificationCode});

        res.status(200).json({message:"OTP sent to Email successfully!"});

    } catch (error) {
        next(error);
    }
}

const signUp = async (req , res , next) => {
    try {
        const userData = await CheckEmail.findOne({email:req.body.email , otp:req.body.otp})

        if (userData) {
            const {name , email , phone , password} = userData
            const user = await User.create({email , name , password , phone , role:"reader"});
            await CheckEmail.findByIdAndDelete(userData._id);
            return res.status(200).json(user);
        }
        res.status(422).json({message : "OTP invalid"});
    } catch (error) {
        next(error);
    }
}

module.exports = { createUser , signUp }