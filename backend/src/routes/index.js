const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const statsRoutes = require("./stats.routes");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/products/stats", statsRoutes); 

module.exports = router;
