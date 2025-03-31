const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "🚀 Comunicación establecida entre frontend y backend." });
});

module.exports = router;
