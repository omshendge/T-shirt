const mongoose=require("mongoose");
const initdata = require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL='mongodb://127.0.0.1:27017/trial';

main().then(()=>{
    console.log("DB connected");
}).catch(err=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}




const initDb=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"67a7588cdff902569f2ae23b"}))
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};

initDb();