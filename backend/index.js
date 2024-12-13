import connectDB from "./src/db/index.js";
import { port } from "./src/constants.js";
import express from "express";
import cookieParser from "cookie-parser";
import { allowedOrigins } from "./src/constants.js";
import userRouter from "./src/routes/user.route.js";
import offerRouter from "./src/routes/offer.route.js";
import authRouter from "./src/routes/auth.route.js";
import eventRouter from "./src/routes/event.route.js";
import paymentRouter from "./src/routes/payment.route.js";
import { updateOldEvents, updateOldOffers } from "./src/utils/helper.js";
import cron from "node-cron";
import apiKeyMiddleware from "./src/middleware/apiKeyMiddleware.js";

// Create an express app
const app = express();

// Middlewares
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,X-API-Key",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(apiKeyMiddleware);

// Connect to MongoDB
connectDB()
  .then(async () => {
    // Routes
    app.use("/api/event", eventRouter);
    app.use("/api/offer", offerRouter);
    app.use("/api/user", userRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/payment", paymentRouter);

    // Default route
    app.get("/", (req, res) => {
      res.send("Server is up and running!");
    });

    // Schedule the updateOldEvents function to run at midnight every day
    cron.schedule("0 0 * * *", async () => {
      console.log(
        "Running the updateOldEvents updateOldOffers & function at midnight",
      );
      await updateOldEvents();
      await updateOldOffers();
    });

    // Start the server
    app.listen(port, async () => {
      console.log(`Server is running at port ${port}`);
      // Call the function to delete old events and update wishlists
      await updateOldEvents();
      await updateOldOffers();
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!!", err);
  });
