const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = "msaleh01550191001";

const authenticate = async (req , res , next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message : "Missing authorization header, make sure you are login."
        })
    }
    try {
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(JWT_SECRET)
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