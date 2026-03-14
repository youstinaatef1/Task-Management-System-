//require mongoose
const mongoose = require("mongoose");
//create schema
const providerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
         type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    price:{
        type: Number,
        required: true
    },
    completedJobs:{
        type: Number,
        required: true
    },
    experience:{
        type: String,
    }
},{timestamps: true});
// const reviewSchema = new mongoose.Schema({
//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     provider:{
//          type: mongoose.Schema.Types.ObjectId,
//          ref:"Providers"
//     },
//     rating:{
//         type:Number,
//         min:1,
//         max:5
//     },
//     comment:String
// },{timestamps: true});
//create model
const Providers = mongoose.model("Providers" ,providerSchema);
//export
module.exports = Providers;
