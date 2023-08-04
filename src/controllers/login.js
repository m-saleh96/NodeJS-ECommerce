const { User } = require('../models/user');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config();

const login = async (req , res , next) => {
    try {
        const user = await User.findOne({email : req.body.email})

        if (!user || !(await bcrypt.compare(req.body.password , user.password))) {
            return res.status(401).json({
                message: "please check email or password"
            })
        }
        // generate token
        const accessToken = jwt.sign(
            { 
                userId: user._id ,
                email:user.email ,
                role:user.role,
                name:user.name
            }, 
            process.env.JWT_SECRET,
            { 
                expiresIn:'3h' 
            }
        );
        
        const isAdmin = user.role === "admin" ? true:false ; 

        res.status(200).json({
            message: "success",
            data:{
                token : accessToken,
                isAdmin : isAdmin,
                userId : user._id,
                userName:user.name,
                email:user.email
            },
        })
    } catch (error) {
        next(error);
    }
}

module.exports = { login }