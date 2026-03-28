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
    image:{
        type: String,
        required: true
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

//create model
const Providers = mongoose.model("Providers" ,providerSchema);
//export
module.exports = Providers;
