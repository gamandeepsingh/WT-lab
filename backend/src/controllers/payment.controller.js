import Razorpay from "razorpay";
import crypto from "crypto";

import User from "../models/user.model.js";
import Events from "../models/event.model.js";

export const createOrder = async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const { amount, eventTitle } = req.body;

    const generateReceiptId = (title) => {
      const titlePart = title.substring(0, 4).toUpperCase(); // First 4 letters of event title
      const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase(); // Random alphanumeric string
      return `FYV-${titlePart}-${randomPart}`;
    };
    const receiptId = generateReceiptId(eventTitle);

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: receiptId,
    };
    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const verifyOrder = async (req, res, next) => {
  try {
    const { razorpay_orderID, razorpay_paymentID, razorpay_signature } =
      req.body;
    const sign = razorpay_orderID + "|" + razorpay_paymentID;
    console.log("Sign: ", sign);
    const resultSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");
    console.log("Result Sign: ", resultSign);
    console.log("Signature: ", razorpay_signature);

    if (razorpay_signature == resultSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    }
  } catch (error) {
    console.log("Verify error: ", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const getEventBookings = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  const { eventId } = req.params;

  try {
    const payments = await razorpay.payments.all({
      count: 100,
    });
    const eventPayments = payments.items
      .filter((payment) => payment.notes.event_id === eventId) // Filter by event ID
      .filter((payment) => payment.status === "captured");
    res.status(200).json({ success: true, data: eventPayments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching payments" });
  }
};

export const getEventOrders = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  try {
    const payments = await razorpay.payments.all({
      count: 100,
    });
    let eventPayments = payments.items.filter(
      (payment) => payment.status === "captured",
    );
    
    const { organizerId } = req.query;
    if (organizerId) {
      const organizer = await User.findById(organizerId);
      const events = await Events.find({ postedBy: organizer.email });
      eventPayments = eventPayments.filter(payment => events.some(event => event._id.toString() === payment.notes.event_id));
    }

    res.status(200).json({ success: true, data: eventPayments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching payments" });
  }
};

export const getUserBookings = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  const { userId } = req.params;
  try {
    const payments = await razorpay.payments.all({
      count: 100,
    });
    const userPayments = payments.items
      .filter((payment) => payment.notes.user_id === userId)
      .filter((payment) => payment.status === "captured");
    res.status(200).json({ success: true, data: userPayments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching payments" });
  }
};
