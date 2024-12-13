import React, { useEffect, useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import useEvents from "../hooks/useEvents";
import { PiSmileySadThin } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import { LuPartyPopper } from "react-icons/lu";
import { GrWorkshop } from "react-icons/gr";
import { reverseGeocode } from "../utils/Data";
import { useSelector, useDispatch } from "react-redux";
import { updateCity, updateState } from "../redux/user/userSlice";
import toast from "react-hot-toast";
import { IoMdMicrophone } from "react-icons/io";
import { locations } from "../constants";

const Banner = () => {
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [events] = useEvents();
  const city = useSelector((state) => state.user.city);
  const state = useSelector((state) => state.user.state);
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showModal]);

  useEffect(() => {
    const closeSearchBar = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchText("");
      }
    };

    document.addEventListener("click", closeSearchBar);

    return () => {
      document.removeEventListener("click", closeSearchBar);
    };
  }, [searchRef]);

  const toggleSearchBar = () => {
    setSearchOpen(!searchOpen);
  };

  // Function to detect user's location
  const handleDetectLocation = () => {
    setLoadingLocation(true); // Start loading

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const { city, state } = await reverseGeocode(latitude, longitude);

        // Update Redux state
        dispatch(updateCity(city));
        dispatch(updateState(state));
        setSelectedLocation(`${city}, ${state}`);
        toast.success(`Your Location is updated to ${city}!`);
        setShowModal(false);

        setLoadingLocation(false); // Stop loading
      },
      (error) => {
        setLoadingLocation(false); // Stop loading on error
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Please enable location access to use this feature.");
        } else {
          console.error("Error fetching the location", error);
          toast.error("Error fetching the location");
        }
      },
    );
  };

  const filteredEvents = events
    ? events.filter(
        (event) =>
          event.status !== "Inactive" &&
          (event.Title.toLowerCase().includes(searchText.toLowerCase()) ||
            event.State.toLowerCase().includes(searchText.toLowerCase()) ||
            event.City.toLowerCase().includes(searchText.toLowerCase()) ||
            event.description
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            event.language.toLowerCase().includes(searchText.toLowerCase()) ||
            event.Type.toLowerCase().includes(searchText.toLowerCase())),
      )
    : [];

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCityClick = () => {
    setShowModal(true);
  };

  const handleModalSave = () => {
    const [city, state] = selectedLocation.split(", ");

    // Check if selectedLocation is in the list of predefined locations
    const isValidLocation = locations.some(
      (loc) => loc.city === city && loc.state === state,
    );

    if (isValidLocation) {
      dispatch(updateCity(city));
      dispatch(updateState(state));
      setShowModal(false);
      toast.success(`Your Location is updated to ${city}!`);
    } else {
      toast.error("Please select a valid location from the list.");
    }
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };
  return (
    <div
      className={` text-white md:text-black my-4 absolute top-1/3 w-full md:relative dark:text-white z-[2] flex justify-center space-y-4 items-center flex-col`}
    >
      <button
        onClick={handleCityClick}
        className="border-2 px-4 py-2 text-xs rounded-full text-white md:text-black border-white md:border-black dark:text-primary border-solid dark:border-primary"
      >
        {city ? city : "Select your city"}
      </button>

      <h1 className="text-2xl lg:text-4xl text-center font-semibold font-poppins md:mb-4">
        Experience the joy of being present
      </h1>
      {/* Search bar */}
      <div className="flex justify-center w-full items-center md:flex-row flex-col md:gap-0 gap-4 ">
        <div
          className="flex relative items-center rounded-md shadow-lg md:w-1/3 w-3/4"
          ref={searchRef}
        >
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Enter your vibe here..."
            className=" text-xs md:text-sm block flex-1 focus:outline-black dark:focus:outline-primary rounded-md py-3 pl-4 md:placeholder:text-black bg-black/5 dark:bg-white/20 backdrop-blur-md placeholder:text-white placeholder:dark:text-white placeholder:text-xs focus:right-0 font-poppins border dark:border-0 border-white md:border-0 sm:text-sm sm:loading-6"
            value={searchText}
            onChange={handleSearchChange}
            onClick={toggleSearchBar}
          />
          <div
            className="absolute p-2 rounded-md cursor-pointer right-0 mr-2 dark:text-white text-white md:text-black"
            onClick={() => (searchText ? setSearchText("") : toggleSearchBar())}
          >
            {searchText ? <AiOutlineClose size={15} /> : <FiSearch size={15} />}
          </div>
        </div>
      </div>

      {/* Items based on search */}
      {searchOpen && searchText !== "" && (
        <div className="flex flex-col border border-black no-scrollbar absolute top-44 md:w-1/3 w-3/4 mx-auto overflow-y-auto rounded-md max-h-96">
          {filteredEvents.length === 0 ? (
            <div className=" bg-white dark:bg-darkPrimary p-4 text-black dark:text-primary rounded-md">
              <p className="text-center flex flex-col justify-center items-center gap-4">
                <PiSmileySadThin size={100} /> Sorry, we couldn't find event
                that you're looking for!
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-darkPrimary p-4 text-black dark:text-white rounded-md">
                <p className=" text-xs pb-2">Explore things to book</p>
                <ul className="flex flex-wrap gap-2">
                  <li>
                    <Link
                      to="/category/Concert"
                      className="active:bg-white/40 dark:bg-white/20 dark:text-white ring-primary focus:ring-1 ring-offset-2 ring-offset-body relative inline-flex items-center justify-center gap-1 overflow-hidden text-center transition disabled:bg-input/10 disabled:text-text/40 focus:outline-none disabled:cursor-not-allowed rounded-md bg-body-lighter hover:bg-black hover:text-white dark:hover:bg-primary/30 focus:bg-primary/30 active:text-text shrink-0 px-2.5 py-1 text-xs md:text-sm  shadow-md"
                    >
                      <span className="flex gap-2 items-center">
                        <LuPartyPopper />
                        Concerts
                      </span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/category/Poetry"
                      className="active:bg-white/40 dark:bg-white/20 dark:text-white ring-primary focus:ring-1 ring-offset-2 ring-offset-body relative inline-flex items-center justify-center gap-1 overflow-hidden text-center transition disabled:bg-input/10 disabled:text-text/40 focus:outline-none disabled:cursor-not-allowed rounded-md bg-body-lighter hover:bg-black hover:text-white dark:hover:bg-primary/30 focus:bg-primary/30 active:text-text shrink-0 px-2.5 py-1 text-xs md:text-sm  shadow-md"
                    >
                      <span className="flex gap-2 items-center">
                        <IoMdMicrophone />
                        Poetry
                      </span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/category/Meetup"
                      className="active:bg-white/40 dark:bg-white/20 dark:text-white ring-primary focus:ring-1 ring-offset-2 ring-offset-body relative inline-flex items-center justify-center gap-1 overflow-hidden text-center transition disabled:bg-input/10 disabled:text-text/40 focus:outline-none disabled:cursor-not-allowed rounded-md bg-body-lighter hover:bg-black hover:text-white dark:hover:bg-primary/30 focus:bg-primary/30 active:text-text shrink-0 px-2.5 py-1 text-xs md:text-sm shadow-md"
                    >
                      <span className="flex gap-2 items-center">
                        <GrWorkshop />
                        Meetup
                      </span>
                    </Link>
                  </li>
                </ul>
                <p className=" text-xs my-4">Search Results</p>
                {filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    className=" bg-white relative dark:bg-darkPrimary flex gap-4 text-black dark:text-white hover:bg-black hover:text-white rounded-md  p-2"
                  >
                    <img
                      className="w-1/3 h-auto aspect-square object-cover rounded-md"
                      src={event.Image[0]}
                      alt="..."
                    />
                    <Link to={`event/${event._id}`}>
                      <h2 className="text-sm md:text-lg line-clamp-1 w-full">
                        {event.Title}
                      </h2>
                      <hr />
                      <p className="text-xs mt-2  line-clamp-3">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs hidden md:block mt-2">
                          {event.Date}
                        </p>
                        <p className="text-xs mt-2">
                          {event.City}, {event.State}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-dullBlack text-black dark:text-white md:w-1/3 w-3/4 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-center">
              <button
                className=" bg-secondary active:bg-primary dark:bg-primary  dark:active:bg-secondary active:text-white px-4 py-2 text-xs rounded-md text-white dark:text-secondary relative flex items-center justify-center"
                onClick={handleDetectLocation}
                disabled={loadingLocation}
              >
                {loadingLocation ? (
                  <span>Detecting...</span>
                ) : (
                  <span>Detect My Location</span>
                )}
              </button>
            </div>

            <div className="my-4 flex items-center justify-between">
              <span className="border-b w-1/5 border-black/20 dark:border-primary lg:w-1/4"></span>
              <p className="text-xs text-center text-gray-500 uppercase">OR</p>
              <span className="border-b w-1/5 border-black/20 dark:border-primary lg:w-1/4"></span>
            </div>

            <div className="mb-4">
              <h2 className="block text-sm mb-2 text-center">
                Search Your City
              </h2>
              <select
                className="border p-2 rounded bg-transparent text-xs w-full"
                value={selectedLocation}
                onChange={handleLocationChange}
              >
                <option value="" disabled>
                  Select a city
                </option>
                {locations.map((loc, index) => (
                  <option
                    key={index}
                    value={`${loc.city}, ${loc.state}`}
                    className="text-black"
                  >
                    {loc.city}, {loc.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-3 py-2 bg-black dark:bg-primary text-xs text-white dark:text-black rounded-md"
                onClick={handleModalSave}
              >
                Save
              </button>
              <button
                className="px-3 py-2 bg-transparent border border-black dark:border-0 dark:bg-secondary text-xs text-black dark:text-white rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
