const {Router} = require('express');

const loginUser = Router();

const { login } =  require('../../controllers/login');

loginUser.route('/login')
    .post(login)

module.exports = loginUser