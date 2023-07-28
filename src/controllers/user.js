const {User} = require('../models/user');

const setAdmin = async(req , res ,next) =>{
    
    try {
        const user = await User.findOne({email : req.body.email});
        if(!user){
            return res.status(401).json({'message' :"Email is not registered"})
        }

        if (user.role == "admin") {
            return res.status(401).json({'message' :"user aready admin"});
        }

        await User.findByIdAndUpdate(user._id , {role:"admin"});

        res.status(200).json({
            message: "Successfully updated role as admin",
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {setAdmin}