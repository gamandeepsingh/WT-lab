import React from "react";
import { useSelector } from "react-redux";

const Sidebar = ({
  filters,
  handleFilterChange,
  states,
  cities,
  handleStateChange,
  typeOptions,
  handleTimeRangeChange,
  clearAllFilters,
  setShowSidebarModal
}) => {
  const timeRanges = [
    { label: "After 12am", value: "00:00-06:00" },
    { label: "After 6am", value: "06:00-12:00" },
    { label: "After 12pm", value: "12:00-18:00" },
    { label: "After 6pm", value: "18:00-24:00" },
  ];

  const state = useSelector((state) => state.user.state);
  const city = useSelector((state) => state.user.city);

  return (
    <div className="flex mt-4 md:mt-0 flex-col gap-2 w-full text-black">
      {/* State Filter */}
      <div>
        <h2 className="text-lg font-bold text-black dark:text-white">State</h2>
        <select
          className="border w-full rounded-md p-2  bg-white text-black"
          onChange={(e) => handleStateChange(e.target.value)}
          value={filters.state || ""}
        >
          <option value="">Select State</option>
          {/* {state ? (
            <option value={state}>{state}</option>
          ) : (
            <option value="">Select State</option>
          )} */}
          {states.map((state) => (
            <option key={state[0]} value={state[0]}>
              {state[1]}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div>
        <h2 className="text-lg font-bold text-black dark:text-white">City</h2>
        <select
          className="border w-full rounded-md p-2  bg-white  text-black"
          onChange={(e) => handleFilterChange("city", e.target.value)}
          value={filters.city || ""}
        >
          <option value="">Select City</option>
          {/* {city ? (
            <option value={city}>{city}</option>
          ) : (
            <option value="">Select City</option>
          )} */}
          {cities.map((city) => (
            <option key={city[0]} value={city[0]}>
              {city[1]}
            </option>
          ))}
        </select>
      </div>

      {/* Start Time Range Filter */}
      <div>
        <h2 className="text-lg font-bold text-black dark:text-white">Time</h2>
        <div className="flex flex-wrap">
          {timeRanges.map((range, index) => (
            <div key={range.value} className={`w-1/2 p-1`}>
              <button
                className={`border rounded-md w-full p-2 ${
                  filters.startTimeRange &&
                  filters.startTimeRange.includes(range.value)
                    ? "dark:bg-primary bg-black text-white dark:text-black"
                    : "bg-white text-black"
                }`}
                onClick={() => handleTimeRangeChange(range.value)}
              >
                {range.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          className="mb-2 border rounded-md p-2 bg-black dark:bg-primary dark:text-black text-white w-full"
          onClick={clearAllFilters}
        >
          Reset Filters
        </button>
        <button
          className="border rounded-md p-2 bg-black dark:bg-primary dark:text-black text-white w-full"          
          onClick={() => setShowSidebarModal(false)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
