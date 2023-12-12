const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const saveUrl = require("../middleware2.js");
// routes for sign up
router.get("/signup",(req,res)=>{
    res.render("singnup.ejs");
});
router.post("/signup",wrapAsync(async (req,res)=>{
    try {
        let {email,username,password}= req.body;
    let newuser = new User({
        email:email,
        username:username,
    });
    let result = await User.register(newuser,password);
    console.log(result);
    req.login(result,(err)=>{
        if(err) {
            return next(err);
        }
        req.flash("sucess","user Registered sucessfully");
    res.redirect("/listings");
    });
      
    } catch(e) {
     req.flash("error",e.message);
     res.redirect("/signup");
    }
   
}));
// routes for login

router.get("/login",(req,res)=>{
    res.render("login.ejs");
});

router.post("/login",saveUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("sucess","Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    
  

});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("sucess","you are logged out");
        res.redirect("/listings");
    })
})


module.exports=router;