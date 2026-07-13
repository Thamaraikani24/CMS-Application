const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// Create Admin
const createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Admin
        const user = await User.create({
           
            email,
            password: hashedPassword
        });

        return res.status(201).json({
    success: true,
    message: "Admin created successfully",
    user: {
        id: user._id,
        email: user.email
    }
});

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check User
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

       return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
        id: user._id,
        email: user.email
    }
});

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createAdmin,
    login
};