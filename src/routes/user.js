const {Router} = require('express');

const user = Router();

const { setAdmin } = require('../controllers/user');

const {authenticate , checkRole} = require('../middlewares/auth');

user.route('/setadmin')
    .post(
        authenticate,
        checkRole("admin"),
        setAdmin
    );

module.exports = user;