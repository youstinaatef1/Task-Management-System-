const express = require("express");
const router = express.Router();
const { register, login, addReview, getProviderReviews } = require("../controller/providerController");
const uploadImageProvider = require("../Middleware/uploadimage");
const userMiddleware = require("../Middleware/userMiddleware");
router.post("/providers", uploadImageProvider, register);
router.post("/loginProvider", login);
router.post("/reviews", userMiddleware, addReview);
router.get("/providersReviews/:providerId", getProviderReviews);

module.exports = router;