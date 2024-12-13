import React, { useState, useEffect } from "react";
import { loadStates, loadCities } from "../utils/Data";
import { typeOptions } from "../constants";
import Sidebar from "../components/Sidebar";
import useEvents from "../hooks/useEvents";
import { FiSearch } from "react-icons/fi";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import { ScrollRestoration } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IoClose } from "react-icons/io5";
import { PiSmileySadThin } from "react-icons/pi";

import { formatDate } from "../utils/Data";
import { useSelector } from "react-redux";

const Explore = () => {
  const state = useSelector((state) => state.user.state);
  const city = useSelector((state) => state.user.city);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("exploreFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          date: null,
          eventType: [],
          state: state || null,
          city: city || null,
          startTimeRange: [],
        };
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [events, loading] = useEvents();
  const [showSidebarModal, setShowSidebarModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // State to toggle date picker visibility

  useEffect(() => {
    if (showSidebarModal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showSidebarModal]);

  useEffect(() => {
    if (showDatePicker) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showDatePicker]);

  useEffect(() => {
    loadStateData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filters, searchTerm, sortOption]);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("exploreFilters", JSON.stringify(filters));
    }
  }, [filters]);

  useEffect(() => {
    setDisplayedEvents(filteredEvents);
  }, [filteredEvents]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const localFormatDate = (dateString) => {
    // Format the event date string to match the format of filters.date
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const applyFilters = () => {
    let filtered = [];

    if (events) {
      filtered = events.filter((event) => {
        let passDateFilter = true;

        switch (event.DateType) {
          case "Single":
            passDateFilter =
              !filters.date ||
              localFormatDate(event.Date) === localFormatDate(filters.date);
            break;
          case "Multi": {
            // Removed 86399 from startTimestamp to include the start date
            const startTimestamp =
              new Date(event.StartDate).getTime() / 1000 - 86399;
            const endTimestamp = new Date(event.EndDate).getTime() / 1000;
            const filterTimestamp = new Date(filters.date).getTime() / 1000;

            passDateFilter =
              !filters.date ||
              (startTimestamp < filterTimestamp &&
                endTimestamp > filterTimestamp);
            break;
          }

          case "Recurring": {
            const DAYS = [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ];

            if (event.RecurringPattern === "Every Weekend") {
              const filterDay = new Date(filters.date).getUTCDay();

              const itemDays = ["Saturday", "Sunday"];

              const filterTimestamp = new Date(filters.date).getTime() / 1000;

              const now = new Date();
              const startOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
              );
              const todayTimestamp = Math.floor(startOfDay.getTime() / 1000);

              if (event.ExpiryDate) {
                const expiryTimestamp =
                  new Date(event.ExpiryDate).getTime() / 1000;

                passDateFilter =
                  !filters.date ||
                  (itemDays.includes(DAYS[filterDay]) &&
                    filterTimestamp >= todayTimestamp &&
                    filterTimestamp <= expiryTimestamp);
                break;
              }

              passDateFilter =
                !filters.date ||
                (itemDays.includes(DAYS[filterDay]) &&
                  filterTimestamp >= todayTimestamp);
            } else {
              const filterDay = new Date(filters.date).getUTCDay();
              const eventDays = event.RecurringDay.split(",");

              const filterTimestamp = Math.floor(
                new Date(filters.date).getTime() / 1000
              );

              const now = new Date();
              const startOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
              );
              const todayTimestamp = Math.floor(startOfDay.getTime() / 1000);

              if (event.ExpiryDate) {
                const expiryTimestamp =
                  new Date(event.ExpiryDate).getTime() / 1000;

                passDateFilter =
                  !filters.date ||
                  (eventDays.includes(DAYS[filterDay]) &&
                    filterTimestamp >= todayTimestamp &&
                    filterTimestamp <= expiryTimestamp);
                break;
              }

              passDateFilter =
                !filters.date ||
                (eventDays.includes(DAYS[filterDay]) &&
                  filterTimestamp >= todayTimestamp);
            }

            break;
          }
          default:
            passDateFilter =
              !filters.date ||
              localFormatDate(event.Date) === localFormatDate(filters.date);
            break;
        }

        let passTypeFilter =
          filters.eventType.length === 0 ||
          filters.eventType.includes(event.Type);

        let passSearchFilter =
          !searchTerm ||
          ["Title", "State", "City", "Type"].some((field) =>
            event[field].toLowerCase().includes(searchTerm.toLowerCase())
          );

        let passCityFilter = !filters.city || event.City === filters.city;

        let passStartTimeRangeFilter =
          filters.startTimeRange.length === 0 ||
          filters.startTimeRange.some((range) => {
            const [start, end] = range.split("-");
            return event.StartTime >= start && event.StartTime < end;
          });

        let passFreeEventFilter =
          !filters.showFreeEvents || event.Price === "Free";

        return (
          passDateFilter &&
          passTypeFilter &&
          passSearchFilter &&
          passCityFilter &&
          passStartTimeRangeFilter &&
          passFreeEventFilter
        );
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(`${a.Date}T${a.StartTime}:00`);
      const dateB = new Date(`${b.Date}T${b.StartTime}:00`);
      return dateA - dateB; // Sort by combined date
    });

    if (sortOption === "priceLowToHigh") {
      filtered.sort((a, b) => {
        const priceA = a.Price === "Free" ? 0 : parseFloat(a.Price);
        const priceB = b.Price === "Free" ? 0 : parseFloat(b.Price);
        return priceA - priceB;
      });
    } else if (sortOption === "priceHighToLow") {
      filtered.sort((a, b) => {
        const priceA = a.Price === "Free" ? 0 : parseFloat(a.Price);
        const priceB = b.Price === "Free" ? 0 : parseFloat(b.Price);
        return priceB - priceA;
      });
    } else if (sortOption === "free") {
      filtered = filtered.filter((event) => event.Price === "Free");
    }

    setFilteredEvents(filtered);
  };

  const loadStateData = async () => {
    const stateData = await loadStates();
    stateData.sort((a, b) => a[1].localeCompare(b[1]));
    setStates(stateData);
  };

  const handleStateChange = async (stateCode) => {
    setFilters({ ...filters, state: stateCode });
    const cityData = await loadCities(stateCode);
    setCities(cityData);
    applyFilters();
  };

  const handleFilterChange = (filter, value) => {
    setFilters({ ...filters, [filter]: value });
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
  };

  const toggleFreeEvents = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      showFreeEvents: !prevFilters.showFreeEvents,
    }));
  };

  const handleTimeRangeChange = (startTime) => {
    let updatedRanges;
    if (filters.startTimeRange.includes(startTime)) {
      updatedRanges = filters.startTimeRange.filter(
        (range) => range !== startTime
      );
    } else {
      updatedRanges = [...filters.startTimeRange, startTime];
    }
    handleFilterChange("startTimeRange", updatedRanges);
  };

  const clearDateFilter = () => {
    setFilters({ ...filters, date: null });
  };

  const clearAllFilters = () => {
    setFilters({
      date: null,
      eventType: [],
      state: null,
      city: null,
      startTimeRange: [],
    });
    setSortOption(null);
    setShowSidebarModal(false);
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("exploreFilters");
    }
  };

  return (
    <div className="">
      <ScrollRestoration />

      <div className="min-h-screen bg-white dark:bg-black mx-auto p-4 relative">
        {/* Filters modal */}
        {showSidebarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="relative bg-white dark:bg-secondary p-4 rounded-md w-full md:w-1/3">
              <Sidebar
                filters={filters}
                handleFilterChange={handleFilterChange}
                handleSearch={handleSearch}
                handleSortChange={handleSortChange}
                states={states}
                cities={cities}
                handleStateChange={handleStateChange}
                typeOptions={typeOptions}
                sortOption={sortOption}
                handleTimeRangeChange={handleTimeRangeChange}
                clearAllFilters={clearAllFilters}
                setShowSidebarModal={setShowSidebarModal}
              />
              <button
                className="mt-4 absolute -top-2 right-2 bg-black text-white dark:bg-primary dark:text-black rounded-full p-2"
                onClick={() => setShowSidebarModal(false)}
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>
        )}
        {/* Date modal */}
        {showDatePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-secondary p-4 rounded-md w-full md:max-w-md flex flex-col justify-center items-center">
              <Calendar
                id="dateInput"
                name="dateInput"
                onChange={(date) => handleFilterChange("date", date)}
                value={filters.date ? new Date(filters.date) : null}
                className="border rounded-lg py-2 px-4 mt-3 w-full"
                onClickDay={() => setShowDatePicker(false)}
              />

              <button
                className="dark:bg-primary rounded-md w-full dark:text-black bg-black text-white p-2 mt-2 "
                onClick={clearDateFilter}
              >
                Clear Date
              </button>
              <button
                className="mt-2 bg-black dark:bg-primary text-white dark:text-black rounded-md p-2 w-full"
                onClick={() => setShowDatePicker(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Search bar */}
        {/* <div className="flex justify-center w-full items-center md:flex-row flex-col md:gap-0 gap-4 ">
        <div className="flex relative items-center rounded-md shadow-lg md:w-1/3 w-3/4">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Enter your vibe here..."
            className="block flex-1 focus:outline-primary rounded-md py-3 pl-4 placeholder:text-black bg-black/5 dark:bg-white/20 backdrop-blur-md placeholder:dark:text-white placeholder:text-xs focus:right-0 font-poppins sm:text-sm sm:loading-6"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="absolute bg-black dark:bg-primary p-2 rounded-md cursor-pointer right-0 mr-2 text-white dark:text-black">
            <FiSearch size={15} />
          </div>
        </div>
      </div> */}

        <div className="flex flex-col md:flex-row gap-2 items-center justify-center">
          <button
            className="p-3 bg-dullBlack dark:bg-primary w-40 rounded-md text-white dark:text-black text-xs"
            onClick={() => setShowDatePicker(!showDatePicker)} // Toggle date picker visibility
          >
            {filters.date ? formatDate(filters.date) : "Select Date"}
          </button>
          <div className="flex items-center justify-between bg-dullBlack dark:bg-secondary rounded-md px-0 text-black w-full md:w-96 overflow-x-scroll no-scrollbar">
            <div className="flex-grow flex justify-center items-center gap-2">
              {typeOptions.map((type) => (
                <button
                  key={type}
                  className={`text-xs rounded-md text-nowrap ${
                    filters.eventType.includes(type)
                      ? "bg-white dark:bg-primary text-black m-1 py-2 p-3"
                      : "bg-transparent text-white dark:text-primary py-3 p-3"
                  }`}
                  onClick={() => {
                    const updatedTypes = filters.eventType.includes(type)
                      ? filters.eventType.filter((t) => t !== type)
                      : [...filters.eventType, type];
                    handleFilterChange("eventType", updatedTypes);
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row justify-between items-center w-full">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-8 mt-8">
              All Events
            </h1>

            {/* Buttons and sorting */}
            <div className="flex items-center justify-between gap-1 md:gap-4 w-full md:w-auto">
              {/* Filter button */}
              <button
                className={` border rounded-md border-black dark:border-none z-10 text-xs py-2 px-4 w-1/2 ${
                  showSidebarModal
                    ? "bg-black text-white dark:bg-primary dark:text-black"
                    : "dark:bg-secondary dark:text-white"
                }`}
                onClick={() => setShowSidebarModal(true)}
              >
                Filters
              </button>

              {/* Free Events button */}
              <button
                className={`border rounded-md border-black dark:border-none z-10 text-xs py-2 px-4 w-full ${
                  filters.showFreeEvents
                    ? "bg-black text-white dark:bg-primary dark:text-black"
                    : "dark:bg-secondary dark:text-white"
                }`}
                onClick={toggleFreeEvents}
              >
                Free Events
              </button>

              {/* Sorting dropdown */}
              <select
                className="border dark:bg-secondary dark:text-white rounded-md border-black dark:border-none z-10 text-xs py-2 px-4 w-full h-full bg-transparent"
                value={sortOption || ""}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="" disabled>
                  Sort by Price
                </option>
                <option value="priceLowToHigh">Low to High</option>
                <option value="priceHighToLow">High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div>
            {displayedEvents.length === 0 ? (
              <div className="h-96 gap-4 flex flex-col justify-center items-center text-black dark:text-white">
                <p className="text-center  flex gap-2 justify-center flex-col items-center">
                  <div className="">
                    <PiSmileySadThin className="mx-auto" size={100} /> No Events
                    found in your City
                    <br />
                    Try to
                    <span
                      className="ml-1    text-gray-500 dark:text-gray-200  underline
                       hover:cursor-pointer"
                      onClick={clearAllFilters}
                    >
                      Reset Filters
                    </span>
                  </div>
                </p>
              </div>
            ) : (
              <div className="mt-8 md:mt-0">
                {displayedEvents
                  .filter((event) => event.status !== "Inactive")
                  .map((event) => (
                    <div
                      className="inline-block align-top w-full sm:w-1/2 lg:w-1/4 p-2"
                      key={event._id}
                    >
                      <EventCard event={event} />
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
