const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware.js");

// Show Wishlist Route
router.get("/wishlist", isLoggedIn, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("items.product");
        
        if (!wishlist || wishlist.items.length === 0) {
            req.flash("info", "Your wishlist is empty.");
            return res.render("wishlist/index.ejs", { wishlist: null });
        }

        res.render("wishlist/index.ejs", { wishlist });
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/");
    }
});

// Add Item to Wishlist Route
router.post("/wishlist/add", isLoggedIn, async (req, res) => {
    const { productId, size } = req.body;

    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user._id,
                items: [],
            });
        }

        // Check if item already exists in wishlist
        const existingItem = wishlist.items.find(
            (item) => item.product.toString() === productId && item.size === size
        );

        if (existingItem) {
            req.flash("info", "Item already in wishlist.");
            return res.redirect("back");
        }

        const product = await Listing.findById(productId);
        if (!product) {
            req.flash("error", "Product not found.");
            return res.redirect("back");
        }

        wishlist.items.push({
            product: productId,
            size,
        });

        await wishlist.save();

        req.flash("success", "Item added to wishlist!");
        return res.redirect(`/listings/${productId}`);
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }
});

// Remove Item from Wishlist Route
router.post("/wishlist/remove/:productId", isLoggedIn, async (req, res) => {
    const { productId } = req.params; // Product ID to remove
    const { size } = req.body; // Size of the product to remove

    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            req.flash("error", "Wishlist not found.");
            return res.redirect("/wishlist");
        }

        // Find item index to remove
        const itemIndex = wishlist.items.findIndex(
            (item) => item.product.toString() === productId && item.size === size
        );

        if (itemIndex !== -1) {
            wishlist.items.splice(itemIndex, 1);
            await wishlist.save();
            req.flash("success", "Item removed from wishlist.");
        } else {
            req.flash("error", "Item not found in wishlist.");
        }

        return res.redirect("/wishlist");
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/wishlist");
    }
});

// Show product details page
router.get('/listings/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('reviews'); 
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render('listings/show', { listing });
    } catch (error) {
        console.error(error);
        res.redirect('/wishlist');
    }
});

module.exports = router;
