if(process.env.NODE_ENV != "production") {
    require("dotenv").config();

} 
// the following code for the cloud service 



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const port = 3000;
const path = require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// store.on("erroe",()=>{
//     console.log("error in mongo session",err);
// });
app.use(session({
    secret:process.env.SECTRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
    store:MongoStore.create({
        mongoUrl:process.env.CONNECT_URL,
        crypto:{
            secret:process.env.SECTRET
        },
        // kitne time baad session update hona chaye bar bar refresh karne par update na ho in sec;
        touchAfter:24*3600,
    }),
})
);
// flash routes se pahale hona chaiye;
app.use(flash());
// passport libray implementation

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.sucess = req.flash("sucess");
    res.locals.errormsg = req.flash("error");
    res.locals.currUser = req.user;
    next();

});
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);

const ExpressError = require("./utils/ExpressError.js");
const listingsRoutes = require("./routes/listing.js");
const reviewsRoutes = require("./routes/review.js");
const userRoutes= require("./routes/user.js");

async function main() {
    await mongoose.connect(process.env.CONNECT_URL);
} 
main()
      .then(()=>{console.log("connection secure");})
      .catch((err)=>{console.log(err);});


//Root route
app.get("/", (req,res)=>{
    res.redirect("/listings");
});

// app.get("/demouser",async (req,res)=>{
//  let fakeUser = new User({
//     email:"singh@gmail.com",
//     username:"singhji"
//  });
//  let result = await User.register(fakeUser,"helloworld");
//  console.log(result);
//  res.send("user registered");
// })

// for listing
app.use("/listings",listingsRoutes);
app.use("/",userRoutes);
app.use("/listings/:id/reviews",reviewsRoutes);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
   let{status=500,message="something is wrong"}=err;
   res.status(status).render("error.ejs",{err});
});

app.listen(port,(req,res)=>{
    console.log("app is listening");
});




