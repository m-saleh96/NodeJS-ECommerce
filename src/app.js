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

const orderRoute = require("./routes/order");

const ratingRoute = require("./routes/rating");

const notfoundRoute = require("./routes/notFound");

const app = express();

// cors for api 
app.use(cors());

// to access folder
app.use(express.static(path.join(__dirname, "../src/assets")));

// Parse JSON data from the request body
app.use(bodyParser.json());

// Parse URL-encoded data from the request body
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

// order route
app.use(orderRoute); 

// rating route
app.use(ratingRoute); 

// notfoundRoute route
app.use(notfoundRoute); 



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