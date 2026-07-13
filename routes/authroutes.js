const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { loginValidation } = require("../validations/authValidation");

// Create Admin (Temporary Route)
router.post(
    "/create-admin",
    authController.createAdmin
);

// Login
router.post(
    "/login",
    loginValidation,
    authController.login
);

module.exports = router;