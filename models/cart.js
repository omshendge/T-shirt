const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Listing", 
                required: true
            },
            size: {
                type: String, 
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1 
            },
            price: {
                type: Number,
                required: true 
            }
        }
    ],

    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


cartSchema.pre("save", function (next) {
    this.totalPrice = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
