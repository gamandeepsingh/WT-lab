import React from "react";
import EventCard from "./EventCard";
import { FaRegCalendarAlt } from "react-icons/fa";
import UpcomingCard from "./UpcomingCard";
import Confetti from "./Confetti";

const UpcomingEvents = ({ allEvents }) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  // const dayAfterTomorrow = new Date(today);
  // dayAfterTomorrow.setDate(today.getDate() + 2);

  const formatDate = (date) => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    const dateString = date.toLocaleDateString("en-IN", options);
    const [weekday, month, day] = dateString.split(" ");
    return `${weekday}, ${day} ${month}`;
  };

  const formatIsoDate = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  const todayEvents = allEvents.filter((event) => {
    const DAYS = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    switch (event.DateType) {
      case "Multi": {
        const startDate = new Date(event.StartDate);
        const endDate = new Date(event.EndDate);

        return today >= startDate && today <= endDate;
      }
      case "Recurring": {
        if (event.RecurringPattern === "Specific Day") {
          return event.RecurringDay === DAYS[today.getDay()];
        } else {
          return today.getDay() === 6 || today.getDay() === 0;
        }
      }
      case "Single":
        return event.Date === formatIsoDate(today);
      default:
        return event.Date === formatIsoDate(today);
    }
  });
  const tomorrowEvents = allEvents.filter(
    (event) => event.Date === formatIsoDate(tomorrow)
  );

  // const dayAfterTomorrowEvents = allEvents.filter(
  //   (event) => event.Date === formatIsoDate(dayAfterTomorrow)
  // );

  return (
    <div className="space-y-1 px-2 mt-8 md:px-12 md:pb-4 z-10">
      {(todayEvents.length > 0 || tomorrowEvents.length > 0) && (
        <h1 className="text-black dark:text-white font-semibold text-2xl p-2">
          <Confetti>Upcoming Events</Confetti>
        </h1>
      )}

      {/* Show events which are today */}
      {todayEvents.length > 0 && (
        <div className="">
          <h2 className="text-black dark:text-white text-sm p-2 flex items-center">
            <FaRegCalendarAlt className="mr-2" />
            {formatDate(today)}
          </h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {todayEvents.map((event) => (
              <UpcomingCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Show events which are tomorrow */}
      {tomorrowEvents.length > 0 && (
        <div className="py-4">
          <h2 className="text-black dark:text-white text-sm p-2 flex items-center">
            <FaRegCalendarAlt className="mr-2" />
            {formatDate(tomorrow)}
          </h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tomorrowEvents.map((event) => (
              <UpcomingCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
