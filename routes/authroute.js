const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const authcontroller = require("../controllers/authcontroller");

const router = express.Router();

router.post("/signup", authcontroller.signup);
router.post(
  "/login",
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  authcontroller.login
);
router.get(
  "/verify/:email/:verification_token",
  authcontroller.verifyUserEmail
);
router.post("/verify/resend/", authcontroller.resendEmailVerificationToken);
router.get("/logout", authMiddleware.protectRoute, authcontroller.logout);

module.exports = router;
