const { Router } = require('express');

const user = Router();

const {
    createUser,
    signUp ,
    checkOTPforgetPassword,
    resetPassword
} = require('../../controllers/signup');

const { userCreateValidationRules } = require('../../middlewares/validationUser');

user.route('/signup')
    .post(
        userCreateValidationRules,
        createUser
    );

user.route('/checkemail')
    .post(
        userCreateValidationRules,
        signUp
    );

user.route('/forgetpassword')
    .post(checkOTPforgetPassword);

user.route('/resetPassword')
    .post(resetPassword);

module.exports =  user;
