// const Listing = require("../models/listing.js");

// module.exports.index=(async (req, res) => {
//         try {
//             const alllisting = await Listing.find({}); 
//             res.render("listings/index.ejs", { alllisting }); 
//         } catch (error) {
//             console.error("Error fetching listings:", error);
//             req.flash("error", "Could not load listings.");
//             res.redirect("/");
//         }
//     });



    // router.get("/new",isLoggedIn, (req, res) => {
 
    //     res.render("listings/new.ejs");
    // });