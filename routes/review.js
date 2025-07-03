const express = require("express");
const router = express.Router({ mergeParams: true }); // Ensure `id` is available
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn,isReviewAuthor } = require("../middleware.js");
const mongoose = require("mongoose");

// 📝 POST route to create a review
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;

    // ✅ Validate ID before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid Listing ID.");
        return res.redirect("/listings");
    }

    let listing = await Listing.findById(id);

    // ✅ Handle case where listing is not found
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
}));

// 🗑 DELETE route for reviews
router.delete("/:reviewid",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;

    // ✅ Validate IDs before querying
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewid)) {
        req.flash("error", "Invalid Listing or Review ID.");
        return res.redirect("/listings");
    }

    let listing = await Listing.findById(id);

    // ✅ Handle case where listing is not found
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);

    req.flash("success", "Review deleted.");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
