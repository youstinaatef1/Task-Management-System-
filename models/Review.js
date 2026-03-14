const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    provider:{
         type: mongoose.Schema.Types.ObjectId,
         ref:"Providers"
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    comment:String
},{timestamps: true});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;