import { errorHandler } from "../utils/error.js";
import Events from "../models/event.model.js";
import User from "../models/user.model.js";

export const createEvent = async (req, res, next) => {
  try {
    const body = req.body;
    body.createAt = new Date();

    const event = await Events.create(body);

    const response = {
      acknowledged: true,
      event,
    };
    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  const event = await Events.findById(req.params.id);
  const userRole = req.params.userRole;
  console.log(userRole);

  if (userRole === "normalUser") {
    return res.status(400).json({
      message: "You are not authorized to update the event.",
    });
  }

  const eventData = req.body;

  if (!event) {
    return next(errorHandler(404, "Event not found!"));
  }

  const organiseDate = new Date(event.Date);

  // Calculate the difference in days between the posting date and today
  const timeDiff = Math.abs(organiseDate - new Date());
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // Check if the update is being done within 2 days after posting
  if (diffDays < 2 && userRole === "organizer") {
    return res.status(400).json({
      message: "Update cannot be done before 2 days of event date.",
    });
  }

  try {
    const updatedEvent = await Events.findByIdAndUpdate(
      req.params.id,
      eventData,
      { new: true },
    );

    const response = {
      acknowledged: true,
      updatedEvent,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const { organizerId } = req.query;
    let events;
    if (organizerId) {
      const organizer = await User.findById(organizerId);
      events = await Events.find({ postedBy: organizer.email });
      return res.status(200).json(events);
    } else {
      events = await Events.find();
    }

    if (!events) {
      return next(errorHandler(404, "event not found!"));
    }

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const getEventId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const event = await Events.findById(id);
    if (!event) {
      return next(errorHandler(404, "event not found!"));
    }
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const getEventEmail = async (req, res, next) => {
  try {
    const email = req.params.email;
    const event = await Events.find({
      postedBy: email,
    });
    if (!event) {
      return next(errorHandler(404, "event not found!"));
    }

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  const event = await Events.findById(req.params.id);

  if (!event) {
    return next(errorHandler(404, "Job not found!"));
  }

  try {
    const organiseDate = new Date(event.Date);
    // Calculate the difference in days between the posting date and today
    const timeDiff = Math.abs(organiseDate - new Date());
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    // Check if the update is being done within 2 days after posting
    if (diffDays < 2) {
      return res.status(400).json({
        message:
          "Listing cannot be deleted before 2 days of the event. Contact Support for query.",
      });
    }
    await Events.findByIdAndDelete(req.params.id);

    const response = {
      acknowledged: true,
      message: "Job has been deleted!",
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// export const updateTicketInventory = async (req, res, next) => {
//   const event = await Events.findById(req.params.id);
//   const { newSeatingCapacity } = req.body;
//   if (!event) {
//     return next(errorHandler(404, "Event not found!"));
//   }
//   try {
//     event.seatingCapCounter = newSeatingCapacity;
//     const updatedEvent = await event.save();
//     res.status(200).json({
//       acknowledged: true,
//       message: "Seating capacity updated successfully.",
//       updatedEvent,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const updateTicketInventory = async (req, res, next) => {
  const event = await Events.findById(req.params.id);
  const { ticketQuantities } = req.body;

  if (!event) {
    return next(errorHandler(404, "Event not found!"));
  }

  try {
    // Update seats for the tickets present in ticketQuantities
    event.tickets = event.tickets.map((ticket) => {
      if (ticketQuantities[ticket._id]) {
        ticket.seats = Math.max(0, ticket.seats - ticketQuantities[ticket._id]); // Ensure seats don't go below 0
      }
      return ticket;
    });

    const updatedEvent = await event.save();

    res.status(200).json({
      acknowledged: true,
      message: "Ticket inventory updated successfully.",
      updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};
