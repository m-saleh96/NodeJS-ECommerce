const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
    productId: { type: mongoose.Types.ObjectId , ref :'product', required: true},
    userId: { type: mongoose.Types.ObjectId , ref :'user', required: true},
});


reviewSchema.post('save', async function () {
    const productId = this.productId;


    const Product = mongoose.model('product');
    await Product.findByIdAndUpdate(productId, { $push: { reviews: this._id }});
});


const Review = mongoose.model("review", reviewSchema);

module.exports = Review;