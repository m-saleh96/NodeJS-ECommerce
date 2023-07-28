const express = require("express");

const mongoose = require('mongoose');

const error = require('./middlewares/error');

const bodyParser = require("body-parser");

const cors = require('cors');

const path = require('path');

const {addAdmin} = require('./models/user');

const productRoute = require("./routes/product");

const signUpUser = require("./routes/auth/signup");

const loginUser = require("./routes/auth/login");

const userRoute = require("./routes/user");

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "../src/assets")));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// error middleware
app.use(error);

// product route
app.use(productRoute); 

// sigUp route
app.use(signUpUser); 

// Login route
app.use(loginUser); 

// Login route
app.use(userRoute); 



mongoose
    .connect('mongodb://0.0.0.0:27017/work')
    .then(()=>{
        console.log("DB Connected");
        addAdmin();
        app.listen(8080 , ()=>{
            console.log('Server is running on port 8080');
        });
    })
    .catch((err)=> console.log("DB Connection Error." + err));