const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.js"); // Your Cart model
const Listing = require("../models/listing.js"); // Your Listing model
const { isLoggedIn } = require("../middleware.js"); // Middleware to check if user is logged in

// Show Cart Route
router.get("/cart", isLoggedIn, async (req, res) => {
    try {
        // Find the user's cart and populate the 'product' field in 'items' array
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

        if (!cart) {
            req.flash("info", "Your cart is empty.");
            return res.render("cart/index.ejs", { cart: null });
        }

        // If the cart exists but some products may be missing, ensure the data is valid
        cart.items = cart.items.filter(item => item.product); // Remove any items with missing products

        res.render("cart/index.ejs", { cart });
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/");
    }
});

// Add Item to Cart Route
router.post("/cart/add", isLoggedIn, async (req, res) => {
    const { productId, size, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [],
            });
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            const product = await Listing.findById(productId);

            if (!product) {
                req.flash("error", "Product not found.");
                return res.redirect("back");
            }

            cart.items.push({
                product: productId,
                size,
                quantity,
                price: product.price,
            });
        }

        await cart.save();

        req.flash("success", "Item added to cart!");
        return res.redirect(`/listings/${productId}`);
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }
});

// Remove Item from Cart Route
router.post("/cart/remove/:productId", isLoggedIn, async (req, res) => {
    const { productId } = req.params;
    const { size } = req.body;

    try {
        console.log("🔍 Product ID received:", productId);
        console.log("📏 Size received:", size);

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart || !cart.items || cart.items.length === 0) {
            console.log("❌ No cart found or cart is empty.");
            req.flash("error", "Cart is empty or not found.");
            return res.redirect("/cart");
        }

        console.log("🛒 Current cart items:", cart.items);

        // Find the index of the product with the matching ID and size
        const itemIndex = cart.items.findIndex(
            (item) => item.product.equals(productId) && item.size === size
        );

        if (itemIndex !== -1) {
            console.log("✅ Item found at index:", itemIndex);
            cart.items.splice(itemIndex, 1); // Remove item

            // If the cart is empty after removal, delete it
            if (cart.items.length === 0) {
                await Cart.findOneAndDelete({ user: req.user._id });
                console.log("🗑️ Cart deleted as it became empty.");
            } else {
                await cart.save();
                console.log("💾 Cart updated successfully.");
            }

            req.flash("success", "Item removed from cart.");
        } else {
            console.log("⚠️ Item not found in cart.");
            req.flash("error", "Item not found in cart.");
        }

        return res.redirect("/cart");
    } catch (err) {
        console.error("❌ Error removing item from cart:", err);
        req.flash("error", "Something went wrong.");
        return res.redirect("/cart");
    }
});

router.get("/cart/:id", isLoggedIn, async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id).populate("items.product");

        if (!cart) {
            req.flash("error", "Cart not found.");
            return res.redirect("/cart");
        }

        res.render("cart/show.ejs", { cart });
    } catch (err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/cart");
    }
});



module.exports = router;
