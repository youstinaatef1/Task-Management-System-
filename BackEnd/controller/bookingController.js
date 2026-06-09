// const Booking = require("../models/Booking");
// const createBooking = async (req, res) => {
//     try {
//         const { providerId, date, time} = req.body;
//         const booking = new Booking({
//             userId: req.user.id,
//             providerId,
//             date,
//             time
//         });
//         await booking.save();
//         res.status(201).json({
//             msg: "Booking Created",
//             data: booking
//         })   
//     } catch (error) {
//         res.status(500).json({ msg: error.message });   
//     }
// }
// const getUserBookings = async (req, res) => {
//     try {
//         const bookings = await Booking.find({ userId: req.user.id})
//         .populate("providerId", "name email image");
//         res.status(200).json({
//             msg: "User Bookings",
//             data: bookings
//         })
        
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// }
// // const updateBookingStatus = async (req, res) => {
// //     try {
// //         const {bookingId} = req.params;
// //         const {status} = req.body;
// //         const booking = await Booking.findByIdAndUpdate(bookingId, {status}, {new: true});
// //         res.status(200).json({
// //             msg: "Booking Status Updated",
// //             data: booking
// //         })
        
// //     } catch (error) {
// //         res.status(500).json({ msg: error.message });
// //     }
// // }
// const updateBookingStatus = async (req, res) => {
//     try {
//         const { bookingId } = req.params;
//         const { status }    = req.body;

//         // ✅ بدل findById، استخدمي findById بدون populate
//         const booking = await Booking.findById(bookingId);
//         if (!booking) {
//             return res.status(404).json({ msg: "Booking not found" });
//         }

//         console.log("providerId:", booking.providerId);  // للتأكد
//         console.log("userId:", booking.userId);           // للتأكد
//         console.log("req.user.id:", req.user.id);         // للتأكد

//         // ✅ تحقق إن الـ field موجود قبل toString
//         const providerId = booking.providerId ? booking.providerId.toString() : null;
//         const userId     = booking.userId     ? booking.userId.toString()     : null;

//         const isProvider = providerId === req.user.id;
//         const isUser     = userId     === req.user.id;

//         if (!isProvider && !isUser) {
//             return res.status(403).json({ msg: "Not authorized" });
//         }

//         if (isUser && status !== "cancelled") {
//             return res.status(400).json({ msg: "You can only cancel bookings" });
//         }

//         if (isProvider && !["confirmed", "completed", "cancelled"].includes(status)) {
//             return res.status(400).json({ msg: "Invalid status" });
//         }

//         booking.status = status;
//         await booking.save();

//         res.status(200).json({ msg: "Booking Status Updated", data: booking });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ msg: error.message });
//     }
// }
// const getProviderBookings = async (req, res) => {
//     try {
//         const bookings = await Booking.find({ providerId: req.user.id })
//             .populate("userId", "userName email");
        
//         res.status(200).json({ msg: "Provider Bookings", data: bookings });
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// }
// module.exports = {
//     createBooking,
//     getUserBookings,
//     updateBookingStatus,
//     getProviderBookings
// }
const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
    try {
        const { providerId, date, time } = req.body;
        const booking = new Booking({
            userId: req.user.id,
            providerId,
            date,
            time
        });
        await booking.save();
        res.status(201).json({ msg: "Booking Created", data: booking });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate("providerId", "name email image");
        res.status(200).json({ msg: "User Bookings", data: bookings });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status }    = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        const providerId = booking.providerId ? booking.providerId.toString() : null;
        const userId     = booking.userId     ? booking.userId.toString()     : null;

        const isProvider = providerId === req.user.id;
        const isUser     = userId     === req.user.id;
        const isAdmin    = req.user.role === "admin"; // ✅ الـ admin يقدر يغير أي status

        if (!isProvider && !isUser && !isAdmin) {
            return res.status(403).json({ msg: "Not authorized" });
        }

        if (isUser && !isAdmin && status !== "cancelled") {
            return res.status(400).json({ msg: "You can only cancel bookings" });
        }

        if (isProvider && !isAdmin && !["confirmed", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({ msg: "Invalid status" });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ msg: "Booking Status Updated", data: booking });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const getProviderBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ providerId: req.user.id })
            .populate("userId", "userName email");
        res.status(200).json({ msg: "Provider Bookings", data: bookings });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// ✅ جديد: الـ admin يشوف كل الـ bookings
// const getAllBookings = async (req, res) => {
//     try {
//         if (req.user.role !== "admin") {
//             return res.status(403).json({ msg: "Admin only" });
//         }
//         const bookings = await Booking.find()
//             .populate("userId",     "userName email")
//             .populate("providerId", "name email")
//             .sort({ createdAt: -1 });

//         res.status(200).json({ msg: "All Bookings", data: bookings });
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// }
const getAllBookings = async (req, res) => {
    try {
        // ✅ مش محتاجين نتحقق من الـ role هنا — الـ adminMiddleware بيعمل ده
        const bookings = await Booking.find()
            .populate("userId",     "userName email")
            .populate("providerId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ msg: "All Bookings", data: bookings });
    } catch (error) {
        console.error("getAllBookings error:", error); // ✅ مهم للـ debugging
        res.status(500).json({ msg: error.message });
    }
}

module.exports = {
    createBooking,
    getUserBookings,
    updateBookingStatus,
    getProviderBookings,
    getAllBookings   // ✅
}
