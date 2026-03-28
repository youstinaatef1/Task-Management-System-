const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Providers"
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending"
    }
    
}, { timestamps: true});

const Booking = mongoose.model("Booking", bookSchema);
module.exports = Booking;