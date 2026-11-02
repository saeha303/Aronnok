require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");

const app = express();

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------
// Connect once per process. On Vercel the module stays warm between requests,
// so the connection is reused; mongoose buffers queries until it is ready.
if (!process.env.DATABASE) {
  console.error("DATABASE is not set. Copy .env.example to .env and fill it in.");
} else if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.DATABASE, { serverSelectionTimeoutMS: 10000 })
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch((err) => console.error("MongoDB connection error:", err.message));
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
// In production the frontend is served from the same origin, so CORS only
// matters for local development or a separately hosted frontend.
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
// Express 5 leaves req.body undefined when there is no body; controllers expect an object.
app.use((req, res, next) => {
  if (req.body === undefined) req.body = {};
  next();
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Static requires (not a loop) so Vercel's bundler can trace every route file.
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/product"));
app.use("/api", require("./routes/category"));
app.use("/api", require("./routes/payment"));
app.use("/api", require("./routes/favourites"));
app.use("/api", require("./routes/wishlist"));
app.use("/api", require("./routes/cart"));
app.use("/api", require("./routes/order"));
app.use("/api", require("./routes/auction"));
app.use("/api", require("./routes/notification"));
app.use("/api", require("./routes/sell"));

app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

// Local development: `npm start` runs a normal server.
// On Vercel the app is imported by api/index.js instead.
if (require.main === module) {
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Server listening on ${port}`));
}

module.exports = app;
