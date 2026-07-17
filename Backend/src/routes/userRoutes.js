const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Logged in users only
router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
});

// Admin only
router.get("/admin", protect, authorize("admin"), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome Admin!"
    });
});

module.exports = router;