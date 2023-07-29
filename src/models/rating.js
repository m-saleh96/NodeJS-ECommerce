const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    rating: { type: Number, required: true, trim: true },
    productId: { type: mongoose.Types.ObjectId , ref :'product', required: true},
    userId: { type: mongoose.Types.ObjectId , ref :'user', required: true},
});

// avarage rating for every product
ratingSchema.post('save', async function () {
    const productId = this.productId;
    const averageRating = await Rating.aggregate([
        { $match: { productId } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);

    const Product = mongoose.model('product');
    await Product.findByIdAndUpdate(productId, { averageRating: averageRating[0].averageRating });
});


const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;