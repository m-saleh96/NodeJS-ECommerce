const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String,required: true,unique: true,
        lowercase: true,match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    phone: {type:String ,required: true,match: /^01\d{9}$/},
    password: {type: String,required: true,minlength: 8},
    role: {type: String,required: true,enum: ["admin", "reader"],default: "reader"}
});

// hash password
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
        return next();  
        }
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});


const User = mongoose.model('user' , userSchema);

const addAdmin = async () => {
    try {
        // Check if admin user already exists
        const adminExists = await User.exists({ role: "admin" });

        if (adminExists) {
            console.log("Admin user already exists. Skipping creation.");
            return;
        }


        // Create the admin user
        const adminUser = new User({
            name: "Mohamed Saleh",
            email: "MohamedSaleh18896@gmail.com",
            phone: "01550191001",
            password: "12345678",
            role: "admin",
        });

        // Save the admin user to the database
        await adminUser.save();

        console.log("Admin user created successfully:", adminUser);
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
};

module.exports = { User , addAdmin }