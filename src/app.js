const express = require("express");

const mongoose = require('mongoose');

const error = require('./middlewares/error');

const bodyParser = require("body-parser");

const cors = require('cors');

const path = require('path')

const productRoute = require("./routes/product");

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "../src/assets")));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// product routes
app.use(productRoute); 

// error middleware
app.use(error);

mongoose
    .connect('mongodb://0.0.0.0:27017/work')
    .then(()=>{
        console.log("DB Connected");
        app.listen(8080 , ()=>{
            console.log('Server is running on port 8080');
        });
    })
    .catch((err)=> console.log("DB Connection Error." + err));