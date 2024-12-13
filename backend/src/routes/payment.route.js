import express from "express";
import {
  createOrder,
  getEventBookings,
  getUserBookings,
  verifyOrder,
  getEventOrders,
} from "../controllers/payment.controller.js";
import sendBookingEmail from "../utils/nodemailer.js";
const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-order", verifyOrder);
router.get("/event/:eventId/bookings", getEventBookings);
router.get("/event/orders", getEventOrders);
router.get("/user/:userId/bookings", getUserBookings);
router.post("/send-email", (req, res) => {
  const { email, username, event, tickets, amount, id } = req.body;
  try {
    sendBookingEmail(email, username, event, tickets, amount, id);
    // res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
});
export default router;
