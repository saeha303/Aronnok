const express = require("express");
const router = express.Router();
const { check, oneOf } = require("express-validator");
const { signup, signin, signout } = require("../controller/auth");

router.post(
    "/signup",
    [
        check("username", "Username should be at least 3 characters").isLength({ min: 3 }),
        check("email", "A valid email is required").isEmail(),
        check("password", "Password should be at least 6 characters").isLength({ min: 6 }),
    ],
    signup
);

router.post(
    "/signin",
    [
        oneOf(
            [check("username").notEmpty(), check("email").isEmail()],
            { message: "Username or email is required" }
        ),
        check("password", "Password is required").notEmpty(),
    ],
    signin
);

router.get("/signout", signout);

module.exports = router;
