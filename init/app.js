const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
async function main() {
    await mongoose.connect(process.env.CONNECT_URL);
} 
main()
      .then(()=>{console.log("connection secure");})
      .catch((err)=>{console.log(err);});


      const initDB = async ()=>{
        await Listing.deleteMany({});
        // initData.data ek array hai jisme map function use hua hai map functio ek ais afunction hai jisme har element of array
        // par jate hai aur map function new arry banata hai aur ek call back leta hai
        initData.data = initData.data.map((obj)=>({...obj,owner:"656b2ca40932de4e6b1ef444"}));
        await  Listing.insertMany(initData.data);
        console.log("data was initalised")
      }

      initDB();
      