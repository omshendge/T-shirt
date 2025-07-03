// const express = require("express");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const { isLoggedIn } = require("../middleware.js");
// const Cart = require("../models/cart.js");
// const Order = require("../models/order.js"); // Assuming you have an Order model

// const router = express.Router();

// // Initialize Razorpay instance
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// // Route to create an order
// router.post("/create-order", isLoggedIn, async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

//         if (!cart || cart.items.length === 0) {
//             req.flash("error", "Your cart is empty.");
//             return res.redirect("/cart");
//         }

//         const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

//         const options = {
//             amount: totalAmount * 100, // Amount in paise (1 INR = 100 paise)
//             currency: "INR",
//             receipt: `order_${Date.now()}`,
//             payment_capture: 1
//         };

//         const order = await razorpay.orders.create(options);

//         res.json({
//             success: true,
//             orderId: order.id,
//             amount: totalAmount,
//             currency: "INR",
//             key: process.env.RAZORPAY_KEY_ID
//         });
//     } catch (error) {
//         console.error("❌ Error creating Razorpay order:", error);
//         res.status(500).json({ error: "Failed to create order" });
//     }
// });

// // Route to verify payment
// router.post("/verify-payment", isLoggedIn, async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//         const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
//         hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//         const generatedSignature = hmac.digest("hex");

//         if (generatedSignature !== razorpay_signature) {
//             return res.status(400).json({ success: false, message: "Payment verification failed" });
//         }

//         // Store the successful payment in the Orders collection
//         const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
//         const newOrder = new Order({
//             user: req.user._id,
//             items: cart.items,
//             totalAmount: cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
//             paymentId: razorpay_payment_id,
//             orderId: razorpay_order_id,
//             status: "Paid"
//         });

//         await newOrder.save();
//         await Cart.findOneAndDelete({ user: req.user._id }); // Clear cart after order

//         req.flash("success", "Payment Successful! Order placed.");
//         res.json({ success: true, message: "Payment verified successfully", redirectUrl: "/orders" });
//     } catch (error) {
//         console.error("❌ Error verifying payment:", error);
//         res.status(500).json({ success: false, message: "Error verifying payment" });
//     }
// });

// module.exports = router;
