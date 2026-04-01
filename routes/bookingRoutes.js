// const express = require("express");
// const router = express.Router();
// const {createBooking, getUserBookings, updateBookingStatus, getProviderBookings} = require("../controller/bookingController");
// const authMiddleware = require("../Middleware/userMiddleware");
// router.post("/bookings", authMiddleware, createBooking);
// router.get("/bookings", authMiddleware, getUserBookings);
// router.patch("/bookings/:bookingId/status", authMiddleware, updateBookingStatus);
// router.get("/providers/:providerId/bookings", authMiddleware, getProviderBookings);
// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const { createBooking, getUserBookings, updateBookingStatus, getProviderBookings } = require("../controller/bookingController");
// const authMiddleware = require("../Middleware/userMiddleware");

// // ✅ الـ /provider لازم يكون قبل /:bookingId
// router.get("/bookings/provider", authMiddleware, getProviderBookings);

// router.post("/bookings", authMiddleware, createBooking);
// router.get("/bookings", authMiddleware, getUserBookings);
// router.patch("/bookings/:bookingId/status", authMiddleware, updateBookingStatus);

// module.exports = router;
// const express = require("express");
// const router  = express.Router();
// const {
//     createBooking,
//     getUserBookings,
//     updateBookingStatus,
//     getProviderBookings,
//     getAllBookings        // ✅ جديد
// } = require("../controller/bookingController");
// const authMiddleware = require("../Middleware/userMiddleware");

// // ✅ /all و /provider لازم يكونوا قبل /:bookingId عشان مش يتعاملوا معاهم كـ id
// router.get("/bookings/all",      authMiddleware, getAllBookings);      // admin
// router.get("/bookings/provider", authMiddleware, getProviderBookings); // provider

// router.post  ("/bookings",                    authMiddleware, createBooking);
// router.get   ("/bookings",                    authMiddleware, getUserBookings);
// router.patch ("/bookings/:bookingId/status",  authMiddleware, updateBookingStatus);

// module.exports = router;
const express = require("express");
const router  = express.Router();
const {
    createBooking,
    getUserBookings,
    updateBookingStatus,
    getProviderBookings,
    getAllBookings
} = require("../controller/bookingController");

const authMiddleware  = require("../Middleware/userMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware"); // ✅ جديد

// ✅ /all و /provider قبل /:bookingId
router.get("/bookings/all",      authMiddleware, adminMiddleware, getAllBookings);
router.get("/bookings/provider", authMiddleware, getProviderBookings);

router.post  ("/bookings",                   authMiddleware, createBooking);
router.get   ("/bookings",                   authMiddleware, getUserBookings);
router.patch ("/bookings/:bookingId/status", authMiddleware, updateBookingStatus);

module.exports = router;