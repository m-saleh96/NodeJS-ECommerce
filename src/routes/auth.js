const { Router } = require('express');

const user = Router();

const {
    createUser
} = require('../controllers/user');

const { userCreateValidationRules } = require('../middlewares/validationUser');

user.route('/signup')
    .post(
        userCreateValidationRules,
        createUser
    );

module.exports =  user;
