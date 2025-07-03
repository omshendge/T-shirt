const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
//const listingController=require("../controllers/listing.js");






//route for collection Type and gender

// Optimized Route to Filter Listings by Gender & Category and searchbar

router.get("/", wrapAsync(async (req, res) => {
    const { search, gender, category } = req.query;  
    let filter = {};  

    if (search) {
        filter.title = { $regex: search, $options: "i" };  
    }

    if (gender) {
        filter.gender = gender;
    }

    if (category) {
        filter.category = category;
    }

   
    try {
        const alllisting = await Listing.find(filter);  
        res.render("listings/index.ejs", { alllisting, search, gender, category });  
    } catch (error) {
        console.error("❌ Error fetching listings:", error);
        req.flash("error", "Could not load listings.");
        res.redirect("/");
    }
}));




//  INDEX Route - Show All Listings
// router.get("/", wrapAsync(async (req, res) => {
//     try {
//         const alllisting = await Listing.find({}); 
//         res.render("listings/index.ejs", { alllisting }); 
//     } catch (error) {
//         console.error("Error fetching listings:", error);
//         req.flash("error", "Could not load listings.");
//         res.redirect("/");
//     }
// }));

//router.get("/",wrapAsync(index));

//  NEW Route 
router.get("/new",isLoggedIn, (req, res) => {
 
    res.render("listings/new.ejs");
});

//  SHOW Route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}));



//  CREATE Route 
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created");
   return res.redirect("/listings"); 
}));

//  EDIT Route 
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
}));

//  UPDATE Route 
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
     let { id } = req.params;
    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Listing Updated");
    return res.redirect("/listings"); 
   
    
}));


//  DELETE Route 
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  //  let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted");
    return res.redirect("/listings"); 
}));








module.exports = router;











