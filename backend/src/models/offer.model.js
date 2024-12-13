import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,      
    },
    Image: [
      {
        type: String,
      },
    ],
    postedBy: {
      type: String,
      required: true,
    },
    postingDate: {
      type: String,
      default: function () {
        const currentDate = new Date().toISOString().split("T")[0];
        return currentDate;
      },
    },
    Date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Offers = mongoose.model("Offers", eventSchema);

export default Offers;
