const Booking = require("../models/Booking");
const createBooking = async (req, res) => {
    try {
        const { providerId, date, time} = req.body;
        const booking = new Booking({
            userId: req.user._id,
            providerId,
            date,
            time
        });
        await booking.save();
        res.status(201).json({
            msg: "Booking Created",
            data: booking
        })   
    } catch (error) {
        res.status(500).json({ msg: error.message });   
    }
}
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id})
        .populate("providerId", "name email image");
        res.status(200).json({
            msg: "User Bookings",
            data: bookings
        })
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
const updateBookingStatus = async (req, res) => {
    try {
        const {bookingId} = req.params;
        const {status} = req.body;
        const booking = await Booking.findByIdAndUpdate(bookingId, {status}, {new: true});
        res.status(200).json({
            msg: "Booking Status Updated",
            data: booking
        })
        
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

module.exports = {
    createBooking,
    getUserBookings,
    updateBookingStatus
}