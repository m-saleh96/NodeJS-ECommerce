const { User } = require('../models/user');

const CheckEmail  = require('../models/checkemail');

const ForgetPassword  = require('../models/forgetPassword');

const bcrypt = require('bcryptjs');

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

        const exist = await CheckEmail.findOne({email:req.body.email});
        if (exist) {
            await CheckEmail.findOneAndDelete({email:req.body.email});
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
        const userData = await CheckEmail.findOne({email:req.body.email , otp:req.body.otp});

        if (userData) {
            const {name , email , phone , password} = userData;
            const user = await User.create({email , name , password , phone , role:"reader"});
            await CheckEmail.findByIdAndDelete(userData._id);
            return res.status(200).json({
                message :"User created Successfully!",
            });
        }
        res.status(422).json({message : "OTP invalid"});
    } catch (error) {
        next(error);
    }
}

const checkOTPforgetPassword = async (req , res , next) =>{
    try {
        const user = await User.findOne({email : req.body.email});

        if (!user) {
            return res.status(422).json({
                message : "email not exist"
            })
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

        await ForgetPassword.create({email : req.body.email , userId : user._id , otp : verificationCode});

        res.status(200).json({message:"OTP sent to Email successfully!"});

    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req , res , next) => {
    try {
        const userData = await ForgetPassword.findOne({email:req.body.email , otp:req.body.otp});

        if (!userData) {
            return res.status(422).json({
                message : "email not exist"
            })
        }

        if (userData) {
            const { userId } = userData;
            if (req.body.newpassword == undefined || req.body.newpassword.length < 8) {
                return res.status(400).json({ message: "8 is min length of password" });
            }

            const password = await bcrypt.hash(req.body.newpassword , 12)
            const user = await User.findByIdAndUpdate( userId , {password});
            await ForgetPassword.findByIdAndDelete(userData._id);
            return res.status(200).json({
                message :"Your Password has been changed Successfully!",
            });
        }
        res.status(422).json({message : "OTP invalid"});
    } catch (error) {
        next(error)
    }
}

module.exports = { createUser , signUp , checkOTPforgetPassword , resetPassword}