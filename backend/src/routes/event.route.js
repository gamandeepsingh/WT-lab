import express from "express";
import {
  createEvent,
  deleteEvent,
  getEventEmail,
  getEventId,
  getEvents,
  updateEvent,
  updateTicketInventory,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/post-event", createEvent);
router.patch("/update-event/:id/:userRole", updateEvent);
router.get("/myEvents/:email", getEventEmail);
router.delete("/delete/:id", deleteEvent);
router.get("/all-events/:id", getEventId);
router.get("/all-events", getEvents);
router.patch("/:id/updateTicketInventory", updateTicketInventory);
export default router;
