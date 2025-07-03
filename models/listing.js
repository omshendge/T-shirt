const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");


const listingSchema=new Schema({
   
        title:{
           type :String,
           required:true,
           
        

        },
    
        
    
    description:{
        type:String,

    },
    image:{
        
        type:String,
        default:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
         
        
    },
    price:{type:Number,
        default:1000,
        
    }
    ,
    gender:{
        type:String,
    },
    category:{
        type:String,
    },
    size:{
        type:Array,
        default:["XS","S","M","L","XL","XXL"]
    },
    
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"

    },

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});

    }
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;



