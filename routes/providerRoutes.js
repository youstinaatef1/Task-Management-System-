const express = require("express");
const router = express.Router();
const { register, login, addReview } = require("../controller/providerController");
router.post("/providers", register);
router.post("/loginProvider", login);
router.post("/reviews", addReview);

module.exports = router;