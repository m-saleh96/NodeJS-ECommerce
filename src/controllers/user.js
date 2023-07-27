const { User } = require('../models/user');

const { validationResult } = require('express-validator');

const createUser = async (req , res , next) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
    
            return res.status(400).json({ errors: errorMessages });
        }
    
        const user = await User.create({...req.body, role:"reader"});

        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}

module.exports = { createUser }