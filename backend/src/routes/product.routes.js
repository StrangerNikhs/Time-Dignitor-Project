const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");
const auth = require("../middlewares/auth.middleware");
const { productSchema } = require("../validators/product.validator");
const validate = require("../middlewares/validate.middleware");

router.get("/", controller.getProducts);
router.get("/refresh", controller.refreshCache);
router.get("/:id", controller.getProductById);
router.post("/", auth, validate(productSchema), controller.createProduct);
router.put("/:id", auth, validate(productSchema), controller.updateProduct);
router.delete("/:id", auth, controller.deleteProduct);

module.exports = router;
