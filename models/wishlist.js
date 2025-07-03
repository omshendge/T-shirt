const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing", // Refers to the Listing model
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
});

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Refers to the User model
        required: true,
    },
    items: [wishlistItemSchema],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
