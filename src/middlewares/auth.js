const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

const authenticate = async (req , res , next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message : "Missing authorization header, make sure you are login."
        })
    }
    try {
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token , process.env.JWT_SECRET)
        req.userId = decodedToken.userId;
        req.role = decodedToken.role;
        req.email = decodedToken.email;
        req.userName = decodedToken.name;
        next();
    } catch (error) {
        res.status(401).json({
            status: "fail",
            message: "Invalid Token",
        });
    }
}

function checkRole(roles) {
    return async (req , res , next) => {
        if (roles !== req.role) {
            return res.status(401).json({
                message : "unauthorized"
            })
        }
        next();
    }
}

module.exports = { checkRole , authenticate}