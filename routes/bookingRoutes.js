const express = require("express");
const router = express.Router();
const {createBooking, getUserBookings, updateBookingStatus} = require("../controller/bookingController");
const authMiddleware = require("../Middleware/userMiddleware");
router.post("/bookings", authMiddleware, createBooking);
router.get("/bookings", authMiddleware, getUserBookings);
router.patch("/bookings/:bookingId/status", authMiddleware, updateBookingStatus);
module.exports = router;