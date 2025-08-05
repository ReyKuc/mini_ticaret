const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.get("/profile", authMiddleware, adminController.getProfile);

module.exports = router;
