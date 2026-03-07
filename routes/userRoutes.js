const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/userController");
router.post("/users", register);
router.post("/logins", login);
module.exports = router;