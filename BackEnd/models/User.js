//require mongoose
const mongoose = require("mongoose");
//create schema
const userSchema = new mongoose.Schema({
    userName:{
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
    role:{
        type: String,
        enum:["admin","user", "provider"],
        default:"user"
    }
},{timestamps: true});
//create model
// const User = mongoose.model("User" ,userSchema);
// //export
// module.exports = User;
module.exports = mongoose.model("User", userSchema);