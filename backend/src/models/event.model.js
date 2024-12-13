import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
      set: (value) => {
        // Split the title into words
        const words = value.split(" ");

        // Capitalize the first letter of each word
        const capitalizedWords = words.map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        );

        // Join the words back into a single string
        return capitalizedWords.join(" ");
      },
    },
    Location: {
      type: String,
      required: true,
    },
    State: {
      type: String,
      required: true,
    },
    City: {
      type: String,
      required: true,
    },

    StartTime: {
      type: String,
      required: true,
    },
    Type: {
      type: String,
      required: true,
    },

    DateType: {
      type: String,
      enum: ["Single", "Multi", "Recurring"],
      required: true,
    },
    Date: String, // For Single Date
    StartDate: String, // For Multi Date and Recurring with end date
    EndDate: String, // For Multi Date or recurring end date if exists
    RecurringPattern: {
      type: String,
      enum: ["Every Weekend", "Specific Day"],
    },
    RecurringDay: String, // for 'Specific Day' option
    ExpiryDate: {
      type: String,
      default: "2050-01-01",
    },
    Image: [
      {
        type: String,
      },
    ],
    Video: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    Price: {
      type: String,
      required: true,
    },
    EventCost: {
      type: String,
    },
    tickets: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        limitedEntry: { type: Boolean, required: true },
        seats: { type: Number, default: 0 },
        seatValue: { type: Number, default: 1 },
        description: { type: String, required: true },
      },
    ],
    postedBy: {
      type: String,
      required: true,
    },
    postedByMobile: {
      type: String,
      required: true,
    },
    postingDate: {
      type: String,
      required: true,
      default: function () {
        const currentDate = new Date().toISOString().split("T")[0];
        return currentDate;
      },
    },

    seatingCapacity: {
      type: Number,
    },
    seatingCapCounter: {
      type: Number,
    },
    language: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    promotion: {
      type: String,
      default: "no",
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true },
);

const Events = mongoose.model("Events", eventSchema);

export default Events;
