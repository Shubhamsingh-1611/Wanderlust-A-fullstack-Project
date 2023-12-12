const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const isLoggedIn = require("../middleware.js");
const isOwner  = require("../middleware3.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const{storage} = require("../cloudConfig.js");
// for requiring the map
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});

const upload = multer({storage});
 
    // schema validation middleware
    const validateListing= (req,res,next)=>{
        let result = listingSchema.validate(req.body);
        if(result.error) {
           throw new ExpressError("400",result.error.message);
        } else {
            next();
        }
    };


//Index Route listings
router.get("/", wrapAsync(listingController.index));
 //new route listings
 router.get("/new",isLoggedIn, (req,res,next)=>{
 
     res.render("new.ejs")
 });
 //show route listings
 router.get("/:id", wrapAsync(async (req,res,next)=>{
     let {id} = req.params;
     let listing = await Listing.findById(id)
     .populate({
        path:'reviews',populate:{
        path:"author",
     }})
     .populate("owner");
     if(!listing) {
        req.flash("error","listing does not exist");
        res.redirect("/listings");
     }
     res.render("show.ejs",{listing});
 }));
//  the sequence in the schema AND THE COD EIS VERY IMPORTAN TO UNDERSTAND
 // next parameter for error handling.
 router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(async (req,res,next)=>{
        // code for th map coordinates
      let result = await  geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
          })
            .send()
           

          
    
    
    let url = req.file.path;
         let filename = req.file.filename;
         console.log(url,"..",filename);
         
         let newlisting = new Listing(req.body.listing);
         newlisting.owner = req.user._id;
        //  cloud service
         newlisting.image= {filename,url};
        //  maps code
         newlisting.geometry=result.body.features[0].geometry;
         let savedListing = await newlisting.save();
         console.log(savedListing);
         
         console.log("added sucessfuly");
         req.flash("sucess","listing added sucessfully");
         res.redirect("/listings");
         
     
 }));
// router.post("/",upload.single("listing[image]"),(req,res)=>{
// res.send(req.file);
// });
 // edit route listings
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res,next)=>{ 
     let {id} = req.params;

    let listing= await Listing.findById(id);
    
    if(!listing) {
        req.flash("error","listing does not exist");
        res.redirect("/listings");
     }
     let originalImageUrl = listing.image.url;
    // cloudinary have some inbuild feature so that we can blur the iamge or we can reduce or incerase the pixel by changing the url link

    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_250");
     res.render("edit.ejs",{listing,originalImageUrl});
 
 }));

//  logged in ke baad owner check kara hai
 // update route listings
 router.put("/:id", isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(async (req,res,next)=>{
     let{id}=req.params;
     let newlisting = req.body.listing;
    //  let listing = await Listing.findById(id);
    //  if(!(listing.owner.id===res.locals.currUser)) {
    //     req.flash("error","You not have permission to edit the listing");
    //     return res.redirect(`/listings/${id}`)
    //  }
     
   let listing =  await Listing.findByIdAndUpdate(id,{...newlisting});
    //  req.file store the information of the image on the cloudinary ;
   if(typeof req.file!=="undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image ={filename,url};
        await listing.save();
     }
    req.flash("sucess","listing updated sucessfully");
    res.redirect(`/listings/${id}`);
 }));
 // delete route listings
 router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res,next)=>{
     let{id} = req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("sucess","listing deleted sucessfully");
     res.redirect("/listings");
 }));
 module.exports=router;



      // first method to acess data
     // let {title,description,image,price,location,country}=req.body;
     // let newList = ({
     //     title:title,
     //     description:description,
     //     image:image,
     //     price:price,
     //     location:location,
     //     country:country,
 
     // });
     // console.log(newList);
     // res.send("working");
 
     // second method to acess data
     // try {