const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const { signupSchema, signinSchema } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");
const auth = require("../middlewares/auth.middleware");

router.post("/signup", validate(signupSchema), controller.signup);
router.post("/signin", validate(signinSchema), controller.signin);
router.post("/logout", auth, controller.logout);

module.exports = router;
