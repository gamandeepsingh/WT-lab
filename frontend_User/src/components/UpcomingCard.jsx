import React from "react";
import { Link } from "react-router-dom";
import { BsCalendar2Date } from "react-icons/bs";
import { IoPersonOutline, IoLocationOutline } from "react-icons/io5";
import { MdOutlineLocationOn } from "react-icons/md";
import { formatDate, startToEndDateFormat } from "../utils/Data";

const UpcomingCard = ({ event }) => {
  const getEventDate = () => {
    switch (event.DateType) {
      case "Single":
        return event.Date ? formatDate(event.Date) : "";
      case "Multi":
        if (!event.StartDate || !event.EndDate) return "";
        return startToEndDateFormat(event.StartDate, event.EndDate);
      case "Recurring":
        return event.RecurringPattern === "Specific Day"
            ? `Every ${event.RecurringDay || ""}`
            : "Every Weekend";
      default:
        return event.Date ? formatDate(event.Date) : "";
    }
  }

  return (
    <Link to={`/event/${event._id}`}>
      <div className="flex gap-4 border border-black dark:border-primary dark:bg-custom-card-gradient shadow-2xl box-border relative rounded-xl overflow-hidden mt-3 h-48 aspect-[20/9]">
        {/* <div className="bg-custom-gradient h-56 absolute bottom-0 w-full"></div> */}
        <img
          className="w-1/2 h-full rounded-3xl p-4 object-cover object-center"
          src={event.Image[0]}
          alt={event.Title}
        />
        <div className="flex flex-col justify-between w-1/2 p-4 pl-0">
          <div>
            <div className="flex justify-between">
              <h2 className="text-black dark:text-white font-semibold text-lg line-clamp-2 leading-6">
                {event.Title}
              </h2>
            </div>
            <p className="mt-2 text-black dark:text-white/50  text-xs line-clamp-3">
              {event.description}
            </p>
          </div>
          <div className="space-y-1 text-xs">
            <div className="mt-3 flex items-center justify-between">
              <span className="text-black dark:text-white/50 flex gap-2 items-center">
                <BsCalendar2Date />
                {getEventDate()}
              </span>
              {event.seatingCapacity && (
                <span className="text-black dark:text-white/50 flex gap-2 items-center">
                  <IoPersonOutline />
                  {event.seatingCapacity}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              {/* <span className="text-black  flex gap-2 items-center truncate">
            <MdOutlineLocationOn />
              {event.City}
            </span> */}
              {/* <div className="text-black  ">
              ₹{event.Price}
        </div> */}
            </div>
          </div>
        </div>
        {/* <div className="bg-primary rounded-t-3xl px-4 py-2 absolute bottom-0 z-10">Book now</div> */}
      </div>
    </Link>
  );
};

export default UpcomingCard;
