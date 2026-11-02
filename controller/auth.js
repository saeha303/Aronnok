const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

const cookieOptions = {
    httpOnly: true,                                   // not readable from JS
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",    // HTTPS only in production
    maxAge: TOKEN_TTL_SECONDS * 1000,
};

// Strip fields a client must never be able to set on their own account.
const PROTECTED_FIELDS = ["_id", "role", "encry_password", "salt", "createdAt", "updatedAt"];
exports.sanitizeUserInput = (body = {}) => {
    const clean = { ...body };
    PROTECTED_FIELDS.forEach((field) => delete clean[field]);
    return clean;
};

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }
    try {
        const { username, email } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                error: "Username or email already exists, please choose a different one",
            });
        }
        const user = new User(exports.sanitizeUserInput(req.body));
        await user.save();
        res.status(201).json({ message: "User signed up successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.signin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }

    // The login form has a single "Email or Username" field.
    const identifier = req.body.username || req.body.email;
    const { password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        if (!user || !(await user.authenticate(password))) {
            return res.status(401).json({ error: "Username/email or password do not match" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: TOKEN_TTL_SECONDS });
        res.cookie("token", token, cookieOptions);
        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.signout = (req, res) => {
    res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
    res.json({ message: "User signout successfully" });
};

// ---------------------------------------------------------------------------
// Middlewares
// ---------------------------------------------------------------------------

// Requires a valid JWT, from the httpOnly cookie or an `Authorization: Bearer` header.
exports.isSignedIn = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = req.cookies.token || (header.startsWith("Bearer ") ? header.slice(7) : null);
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
        req.auth = decoded;
        next();
    });
};

const loadCurrentUser = async (req) => {
    if (!req.currentUser) {
        req.currentUser = await User.findById(req.auth._id);
    }
    return req.currentUser;
};

// Requires the signed-in user to be an admin (role !== 0).
exports.isAdmin = async (req, res, next) => {
    try {
        const user = await loadCurrentUser(req);
        if (!user || user.role === 0) {
            return res.status(403).json({ error: "You are not ADMIN, Access denied" });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Requires the `:userId` in the URL to be the signed-in user, or the user to be an admin.
exports.isSelfOrAdmin = async (req, res, next) => {
    try {
        if (req.params.userId && String(req.params.userId) === String(req.auth._id)) {
            return next();
        }
        const user = await loadCurrentUser(req);
        if (user && user.role !== 0) {
            return next();
        }
        return res.status(403).json({ error: "ACCESS DENIED" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
