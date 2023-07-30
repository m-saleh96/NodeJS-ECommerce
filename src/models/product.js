const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{ type:String , required:true} , 
    price :{type:Number,required: true},
    description : {type: String },
    image : { type:String , required:true},
    categoryId: {type: mongoose.Types.ObjectId , ref :'Category' , required:true},
    averageRating: { type: Number, default: 0 },
    reviews: [
        {type: mongoose.Types.ObjectId , ref :'review'}
    ]
},{ timestamps: true });

// delete all rating for deleted product
productSchema.pre('findOneAndDelete', async function (next) {
    const Rating = mongoose.model('Rating');
    await Rating.deleteMany({ productId: this._conditions._id });
    next();
});

// delete all review for deleted product
productSchema.pre('findOneAndDelete', async function (next) {
    const Review = mongoose.model('review');
    await Review.deleteMany({ productId: this._conditions._id });
    next();
});

const Product = mongoose.model('product' , productSchema);

module.exports = { Product }