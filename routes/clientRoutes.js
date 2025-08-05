const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", clientController.register);
router.post("/login", clientController.login);
router.get("/profile", authMiddleware, clientController.getProfile);

module.exports = router;
