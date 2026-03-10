const express = require("express");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const heroBannerRoutes = require("./routes/heroBannerRoutes");
const demandPredictionRoutes = require("./routes/demandPredictionRoutes");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "10mb" }));

// Configure CORS to allow requests from any localhost Vite dev server port (5173, 5174, etc.)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl/Postman) or any localhost origin
      if (
        !origin ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use("/api/auth/", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", heroBannerRoutes);
app.use("/api/ml", demandPredictionRoutes);

module.exports = app;
