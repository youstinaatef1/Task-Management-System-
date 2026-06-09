require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
mongoose.connect("mongodb://127.0.0.1:27017/projectNode")
.then(() =>{
    console.log("connected Successfully");
})
.catch((error) =>{
    console.log(error);
})
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const User = require("./models/User");
const Providers = require("./models/Providers");
const Review = require("./models/Review");
const Booking = require("./models/Booking");
const { route } = require("./routes/userRoutes");
const userRoutes = require("./routes/userRoutes");
const providerRoutes = require("./routes/providerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api", userRoutes); 
app.use("/api", providerRoutes);
app.use("/api", bookingRoutes);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is Running ${port}`);
});