import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import { PiSmileySadThin } from "react-icons/pi";
import { IoIosArrowForward } from "react-icons/io";
// import { formatDate } from "../utils/Data";

const FilteredEvents = ({ allEvents, typeOptions }) => {
  const [activeTab, setActiveTab] = useState(typeOptions[0]); // Default to the first tab
  const [filterToday, setFilterToday] = useState(false);
  const [filterWeekend, setFilterWeekend] = useState(false);

  const sortedEvents = useMemo(() => {
    return allEvents.slice().sort((a, b) => {
      const dateA = new Date(`${a.Date}T${a.StartTime}:00`);
      const dateB = new Date(`${b.Date}T${b.StartTime}:00`);
      return dateA - dateB; // Sort by combined date
    });
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    return sortedEvents.filter((event) => {
      if (event.Type !== activeTab) {
        return false;
      }

      const today = new Date();
      const dayOfWeek = today.getDay(); // Get the current day of the week
      const upcomingSaturday = new Date(today);
      upcomingSaturday.setDate(today.getDate() + (6 - dayOfWeek));
      upcomingSaturday.setHours(0, 0, 0, 0); // Set to start of the day
      const upcomingSunday = new Date(upcomingSaturday);
      upcomingSunday.setDate(upcomingSaturday.getDate() + 1);
      upcomingSunday.setHours(23, 59, 59, 999); // Set to end of the day

      switch (event.DateType) {
        case "Single": {
          const eventDate = new Date(`${event.Date}T${event.StartTime}:00`);

          if (filterToday) {
            const startOfToday = new Date(now);
            startOfToday.setHours(0, 0, 0, 0);

            const endOfToday = new Date(now);
            endOfToday.setHours(23, 59, 59, 999);
            return eventDate >= startOfToday && eventDate <= endOfToday;
          } else if (filterWeekend) {
            return eventDate >= upcomingSaturday && eventDate <= upcomingSunday;
          }
          break;
        }
        case "Multi": {
          const startDate = new Date(
            `${event.StartDate}T${event.StartTime}:00`
          );
          const endDate = new Date(`${event.EndDate}T23:59:59`);
          if (filterToday) {
            return today >= startDate && today <= endDate;
          } else if (filterWeekend) {
            return (
              (upcomingSaturday >= startDate && upcomingSunday <= startDate) ||
              (upcomingSaturday >= endDate && upcomingSunday <= endDate)
            );
          }
          break;
        }
        case "Recurring": {
          const DAYS = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];

          if (filterToday) {
            if (event.RecurringPattern === "Specific Day") {
            return event.RecurringDay === DAYS[today.getDay()];
            } else {
              return today.getDay() === 6 || today.getDay() === 0;
            }
          } else if (filterWeekend) {
            if (event.RecurringPattern === "Specific Day") {
              return event.RecurringDay === DAYS[6] || event.RecurringDay === DAYS[0];
            } else {
              // Since the other option is for weekends only
              return true;
            }
          }
          break;
        }
      }
      return true;
    });
  }, [sortedEvents, activeTab, filterToday, filterWeekend]);

  // Hook to check if the screen is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const eventsToDisplay = isMobile
    ? filteredEvents.slice(0, 5)
    : filteredEvents;

  const applyFilter = (filterType) => {
    switch (filterType) {
      case "Today":
        setFilterWeekend(false);
        if (filterToday) {
          setFilterToday(false);
        } else {
          setFilterToday(true);
        }
        break;
      case "Weekend":
        setFilterToday(false);
        if (filterWeekend) {
          setFilterWeekend(false);
        } else {
          setFilterWeekend(true);
        }
        break;
      default:
        setFilterToday(false);
        setFilterWeekend(false);
    }
  };

  return (
    <div className="space-y-4 flex flex-col items-center justify-between gap-6 bg-black dark:bg-secondary py-12 mt-8 md:mt-16 mb-4 px-4 md:px-12 z-10">
      {/* Event Type Filter */}
      <div className="flex items-center justify-between mx-auto bg-dullBlack rounded-md px-0 text-black w-full md:w-fit overflow-x-scroll no-scrollbar">
        <div className="flex-grow z-10 flex justify-center gap-2">
          {typeOptions.map((type) => (
            <button
              key={type}
              className={`px-6 py-3 text-xs rounded-md text-nowrap ${
                activeTab === type
                  ? "bg-white dark:bg-primary text-black"
                  : "bg-transparent  text-white dark:text-primary"
              }`}
              onClick={() => setActiveTab(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Date Filter: Today & This Weekend */}
      <div className="flex items-center justify-between mx-auto mb-4 bg-dullBlack rounded-md px-0 text-black w-auto overflow-x-scroll no-scrollbar">
        <div className="flex-grow z-10 flex justify-center gap-2">
          <button
            className={`px-6 py-3 text-xs rounded-md ${
              filterToday
                ? "bg-white dark:bg-primary text-black"
                : "bg-transparent  text-white dark:text-primary"
            }`}
            onClick={() => applyFilter("Today")}
          >
            Today
          </button>
          <button
            className={`px-6 py-3 text-xs rounded-md ${
              filterWeekend
                ? "bg-white dark:bg-primary text-black"
                : "bg-transparent  text-white dark:text-primary"
            }`}
            onClick={() => applyFilter("Weekend")}
          >
            This Weekend
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 no-scrollbar sm:grid-cols-2 lg:grid-cols-4 gap-4 min-h-72">
        {eventsToDisplay.length > 0 ? (
          eventsToDisplay.map((event) => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <div className="flex justify-center items-center w-full h-auto col-span-full">
            <p className="text-primary flex items-center gap-2">
              <PiSmileySadThin /> Sorry, we couldn't find the event that you're
              looking for!
            </p>
          </div>
        )}
      </div>

      {/* Explore All Events Button */}
      <Link to={`/explore`} className="">
        <button className="flex gap-2 items-center bg-white text-black dark:bg-primary dark:text-black px-6 py-3 rounded-md text-xs">
          Explore All Events
          <IoIosArrowForward size={15} />
        </button>
      </Link>
    </div>
  );
};

export default FilteredEvents;
