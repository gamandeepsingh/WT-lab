import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import EventCard from "../components/EventCard";
import Banner from "../components/Banner";
import InterestsModal from "../components/InterestsModal";
import useEvents from "../hooks/useEvents";
import { typeOptions } from "../constants";
import toast from "react-hot-toast";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import PromotionalEvents from "../components/PromotionalEvents";
import FilteredEvents from "../components/FilteredEvents";
import UpcomingEvents from "../components/UpcomingEvents";
import Loader from "../components/Loader";
import { IoIosArrowDown } from "react-icons/io";
import CategoryExplore from "../components/CategoryExplore";
import Confetti from "../components/Confetti";
import CityExplore from "../components/CityExplore";

const Home = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState(currentUser);
  const [showModal, setShowModal] = useState(false);
  const [events, loading] = useEvents();
  const selectedInterests = formData?.Interests || typeOptions;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const city = useSelector((state) => state.user.city);
  const state = useSelector((state) => state.user.state);

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

  // State for managing the number of events shown on mobile
  const [eventsToShow, setEventsToShow] = useState(5); // Initial number of events to show on mobile

  const videoRef = useRef(null);

  useEffect(() => {
    const handlePlayVideo = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
        }
      }
    };

    document.body.addEventListener("click", handlePlayVideo);
    document.body.addEventListener("touchstart", handlePlayVideo);

    return () => {
      document.body.removeEventListener("click", handlePlayVideo);
      document.body.removeEventListener("touchstart", handlePlayVideo);
    };
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.Interests.length === 0) {
      setShowModal(true);
    } else {
      setFormData(currentUser);
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await axios.post(
        `/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = response.data;
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setShowModal(false);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("Error in updating Details");
    }
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setFormData((prevFormData) => {
      const isSelected = selectedInterests.includes(value);
      return {
        ...prevFormData,
        Interests: isSelected
          ? selectedInterests.filter((interest) => interest !== value)
          : [...selectedInterests, value],
      };
    });
  };

  const allEvents = useMemo(() => {
    if (events) {
      let filteredEvents = events.filter(
        (event) => event.status !== "Inactive",
      );

      // Separate location-specific events
      let locationEvents = [];
      if (city && state) {
        locationEvents = filteredEvents.filter(
          (event) => event.City === city && event.State === state,
        );
      }

      // If location has 1 or 2 events, keep them first
      if (locationEvents.length <= 2) {
        filteredEvents = [
          ...locationEvents,
          ...filteredEvents.filter(
            (event) => !(event.City === city && event.State === state),
          ),
        ];
      } else {
        filteredEvents = locationEvents;
      }

      return filteredEvents;
    }
    return [];
  }, [events, city, state]);

  // Irrespective of the location, showing promotional events
  const promotionalEvents = useMemo(() => {
    return [
      ...(events || []).filter(
        (event) => event.promotion === "yes" && event.status !== "Inactive",
      ),
    ].reverse();
  }, [events]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const maxEventsToShow = useMemo(() => {
    if (windowWidth < 640) return eventsToShow; // Show based on the current state
    return allEvents.length; // Show all events on larger screens
  }, [windowWidth, allEvents.length, eventsToShow]);

  const handleShowMore = () => {
    setEventsToShow((prevEventsToShow) => prevEventsToShow + 5); // Increase count by 5
  };

  return (
    <div className="bg-white relative dark:bg-darkPrimary dark:text-white min-h-screen py-0  flex flex-col gap-4">
      {showModal && (
        <InterestsModal
          selectedInterests={selectedInterests}
          handleTypeChange={handleTypeChange}
          handleSave={handleSave}
        />
      )}
      <div className="relative">
        <video
          ref={videoRef}
          className="md:hidden bg-black/90 top-0 left-0 w-full h-[90vh] object-cover"
          src="https://assets.mixkit.co/videos/4026/4026-720.mp4" // replace with your video path
          autoPlay
          controls={false}
          loop
          muted
          playsInline
        ></video>
        <Banner />
      </div>
      {/* <Blob /> */}

      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* Promotional Events */}
          <PromotionalEvents promotionalEvents={promotionalEvents} />

          <CategoryExplore />

          <CityExplore />

          {/* Filtered Events Section */}
          <FilteredEvents allEvents={allEvents} typeOptions={typeOptions} />

          {/* Upcoming Events */}
          <UpcomingEvents allEvents={allEvents} />

          {/* Event Gallery-AllEvents */}
          <div className="z-10 py-4 px-4 md:px-12">
            <h1 className="text-black dark:text-white font-semibold text-2xl p-2 mb-4">
              <Confetti>Event Gallery</Confetti>
            </h1>

            <div className="grid no-scrollbar grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2 overflow-x-auto pb-8">
              {allEvents.slice(0, maxEventsToShow).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Show more button for mobile devices */}
            {windowWidth < 640 && maxEventsToShow < allEvents.length && (
              <button
                className="w-1/2 flex justify-center mx-auto bg-black text-white  dark:bg-primary dark:text-black  py-2 px-4 rounded-md mt-4"
                onClick={handleShowMore}
              >
                <span className="flex gap-1 text-sm justify-center items-center ">
                  Show More <IoIosArrowDown />
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
