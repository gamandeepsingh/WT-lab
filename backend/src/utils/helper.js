import Events from "../models/event.model.js";
import Offers from "../models/offer.model.js";
import User from "../models/user.model.js";

function getFormattedDate(){
    const indiaDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const [month, day, year] = indiaDate.split(',')[0].split('/');    
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return formattedDate;
}
// Function to delete old events and update users' wishlists
export const updateOldEvents = async () => {
  try {
    // Get the current date and time in IST    
    const formattedDate = getFormattedDate();

    // Old Single Day Events
    const oldSingleDayEvents = await Events.find({ Date: { $lt: formattedDate }, DateType: "Single" }, "_id");

    // Old Multi Day Events
    const oldMultiDayEvents = await Events.find({ EndDate: { $lt: formattedDate }, DateType: "Multi" }, "_id");

    // Old Recurring Events
    const oldRecurringEvents = await Events.find({ ExpiryDate: { $lt: formattedDate, $ne: "" }, DateType: "Recurring" }, "_id");

    const oldEventIds = [...oldSingleDayEvents, ...oldMultiDayEvents, ...oldRecurringEvents].map((event) => event._id);

    // Update old events to set their status as "Inactive"
    const updateResult = await Events.updateMany(
      { _id: { $in: oldEventIds } },
      { $set: { status: "Inactive" } }
    );
    console.log("Events updated after midnight");
  } catch (error) {
    console.error("Error updating old events", error);
  }
};

export const updateOldOffers = async () => {
  try {
    // Get the current date and time in IST    
    const formattedDate = getFormattedDate();
    const oldOffers = await Offers.find({ Date: { $lt: formattedDate } }, "_id");
    const oldOfferIds = oldOffers.map((offer) => offer._id);    
    // Update old Offers to set their status as "Inactive"
    const updateResult = await Offers.updateMany(
      { _id: { $in: oldOfferIds } },
      { $set: { status: "Inactive" } }
    );
    console.log("Offers updated after midnight");
  } catch (error) {
    console.error("Error updating Old Offers", error);
  }
};