const router = require("express").Router();
const authController = require("../controllers/auth.controller.js");
const {authToken} = require("../middlewares/auth");

// Public
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected
router.get("/me", authToken, authController.me);

module.exports = router;
