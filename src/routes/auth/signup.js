const { Router } = require('express');

const user = Router();

const {
    createUser,
    signUp
} = require('../../controllers/signup');

const { userCreateValidationRules } = require('../../middlewares/validationUser');

user.route('/checkemail')
    .post(
        userCreateValidationRules,
        createUser
    );

user.route('/signup')
    .post(
        userCreateValidationRules,
        signUp
    );

module.exports =  user;
