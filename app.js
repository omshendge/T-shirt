const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");
const Cart = require("./models/cart.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const cartRoutes = require("./routes/cart.js");
const wishlistRoutes = require("./routes/wishlist.js");
//const paymentRoutes = require("./routes/payment");










// 🔹 Database Connection
const MONGO_URL = 'mongodb://127.0.0.1:27017/trial';
mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ DB Connected"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// 🔹 Middleware & Configurations
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


// 🔹 Session & Flash Configuration
const sessionConfig = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiry
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


app.use(session(sessionConfig));
app.use(flash());


// 🔹 Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 🔹 Global Middleware to Pass Flash Messages to Views
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     //res.locals.messages = req.flash();
//     res.locals.currentUser = req.user; // To access user in all templates
//     next();
// });
app.use((req, res, next) => {
    res.locals.success = req.flash("success") || null;
    res.locals.error = req.flash("error") || null;
    res.locals.currentUser = req.user || null;
    next();
});

// 🔹 Routes
app.get("/", (req, res) => {
    res.send("🏠 Welcome to the App!");
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use(cartRoutes);
app.use("/", wishlistRoutes);
//app.use("/payment", paymentRoutes);




// 🔹 Catch-All Route for 404 Errors
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// 🔹 Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// 🔹 Start Server
app.listen(3000, () => {
    console.log("🚀 Server is running on http://localhost:3000");
});



//  app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User(
//         {
//             email:"student@gmail.com",
//             username:"delta-student",
//         }
//     );

//     let registeruser=await User.register(fakeUser,"hello");
//     res.send(registeruser);
//  });

//middleware server side

//)! 1st step
// app.get("/testlisting",async(req,res)=>{
//     const var1 =new Listing({

//         title:"Core Lab Olive Slim Fit Knitted Polo T-Shirt",
//         description:"Effortless style meets lasting comfort. This 100% cotton long-sleeve polo shirt boasts a slim fit and a versatile olive green hue, making it perfect for any occasion. Machine washable for easy care.",
//         price:1200,

        



//     });
//     await var1.save();
//     console.log("Sampl saved");
//     res.send("successful  test");
// });

// const validateListing=(req,res,next)=>{
//     let{error}=listingSchema.validate(req.body);
    
//     if(error){
//         let errmsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,error);
//     }
//     else{
//         next();
//     }
// }

// const validateReview=(req,res,next)=>{
//     let{error}=reviewSchema.validate(req.body);
    
//     if(error){
//         let errmsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,error);
//     }
//     else{
//         next();
//     }
// }
// //reviews post route

// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     let newreview=new Review(req.body.review);
//     listing.reviews.push(newreview);
//     await newreview.save();
//     await listing.save();

//     res.redirect(`/listings/${listing._id}`); // ✅ Correct


// }));

// //review delete route

// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let{id,reviewId}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);

// }));



// //index route
// app.get("/listings",wrapAsync(async(req,res)=>{
  
//     const alllisting=await Listing.find({});
    
//     res.render("listings/index.ejs",{alllisting});
// }));

// //New route

// app.get("/listings/new",wrapAsync(async(req,res)=>{
//     res.render("listings/new.ejs");


// }));

// //show route

// app.get("/listings/:id",wrapAsync(async(req,res)=>{
//     let  {id} = req.params;
//     const listing =await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing});


// }));

// //create route

// app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
//     let var1=listingSchema.validate(req.body);
//     console.log(var1);
//     if(var1.error){
//         throw new ExpressError(400,var1.error);
//     }
//     const newListing=new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");



    
// }));

// //edit route
// app.get("/listings/:id/edit",validateListing,wrapAsync(async(req,res)=>{
//     let  {id} = req.params;
//     const listing =await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});

// }));

// //update route

// app.put("/listings/:id",validateListing, wrapAsync(async(req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// }));

// //delete route

// app.delete("/listings/:id",wrapAsync(async(req, res) => {
//     let { id } = req.params;
//     let deletelisting=await Listing.findByIdAndDelete(id);
//     console.log(deletelisting);
//     res.redirect("/listings");
// }));


