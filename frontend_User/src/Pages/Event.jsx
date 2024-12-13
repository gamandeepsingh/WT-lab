import React, { useEffect, useState } from "react";
import { Link, ScrollRestoration, useLoaderData } from "react-router-dom";
import axios from "axios";
import { FaGoogle } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import { TbLocationFilled } from "react-icons/tb";
import Share from "../components/Share";
import EventCard from "../components/EventCard";
import { formatDate, startToEndDateFormat } from "../utils/Data";
import { useSelector, useDispatch } from "react-redux";
import { google, outlook } from "calendar-link";
import { PiMicrosoftOutlookLogoDuotone } from "react-icons/pi";
import { GoClock } from "react-icons/go";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import useEvents from "../hooks/useEvents";
import toast from "react-hot-toast";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import Map from "../components/Map";
import Distance from "../components/Distance";
import TicketPage from "../components/TicketPage";
import { Helmet } from "react-helmet-async";

const Event = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [randomEvents, setRandomEvents] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const event = useLoaderData();
  const [events] = useEvents();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [organizer, setOrganizer] = useState("");

  useEffect(() => {
    const fetchOrganizer = async () => {
      if (event) {
        try {
          const response = await axios.get(
            `/api/user/get-user/${event.postedBy}`,
          );
          const { password, ...userData } = response.data;
          setOrganizer(userData);
        } catch (error) {
          console.error("Error fetching organizer:", error);
        }
      }
    };
    // fetchOrganizer();
  }, [event]);

  const similarEvents = (events || []).filter((e) => {
    const matchesCondition =
      e.Type === event.Type && e._id !== event._id && e.status !== "Inactive";
    if (matchesCondition) {
      console.log("Current event:", event);
      console.log("Matching event:", e);
    }
    return matchesCondition;
  });

  useEffect(() => {
    if (similarEvents && similarEvents.length > 0) {
      // Select 4 similarEvents
      const allEvt = similarEvents.slice().sort((a, b) => {
        const dateA = new Date(`${a.Date}T${a.StartTime}:00`);
        const dateB = new Date(`${b.Date}T${b.StartTime}:00`);
        return dateA - dateB; // Sort by combined date
      });
      const selectedEvents = allEvt.slice(0, 4);
      // console.log(selectedEvents);
      setRandomEvents(selectedEvents);
    }
  }, [events]);

  useEffect(() => {
    const updateWishlistStatus = () => {
      if (currentUser) {
        if (currentUser.wishList.find((e) => e === event._id)) {
          setIsInWishlist(true);
        } else {
          setIsInWishlist(false);
        }
      } else if (localStorage.getItem("wishlist")) {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist"));
        if (storedWishlist.includes(event._id)) {
          setIsInWishlist(true);
        } else {
          setIsInWishlist(false);
        }
      } else {
        setIsInWishlist(false);
      }
    };

    updateWishlistStatus();
  }, [currentUser, event]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const addToWishList = async (e) => {
    e.preventDefault();
    let updatedWishlist = [];

    // Check if user is logged in
    if (currentUser) {
      dispatch(updateUserStart());

      try {
        const response = await axios.post(
          `/api/user/add-wishlist/${currentUser._id}`,
          { eventId: event._id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = response.data;
        if (data.success === false) {
          dispatch(updateUserFailure(data.message));
          toast.error("Error in Adding to Wishlist");
          return;
        }

        dispatch(updateUserSuccess(data.rest));
        setIsInWishlist(true);
        toast.success("Added to Wishlist");
        return;
      } catch (error) {
        toast.error(error.response.data.message);
        return;
      }
    } else {
      // User is not logged in, handle wishlist with localStorage
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        updatedWishlist = JSON.parse(storedWishlist);
        // Check if event is already in the wishlist
        if (updatedWishlist.includes(event._id)) {
          toast.error("This event is already in your wishlist!");
          return;
        }
      }

      // Add event to wishlist
      updatedWishlist.push(event._id);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsInWishlist(true);
      toast.success("Added to Wishlist");
    }
  };

  const deleteFromWishList = async (e) => {
    e.preventDefault();
    let updatedWishlist = [];

    // Check if user is logged in
    if (currentUser) {
      dispatch(updateUserStart());

      try {
        const response = await axios.delete(
          `/api/user/delete-wishlist/${currentUser._id}`,
          {
            data: { eventId: event._id },
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = response.data;
        if (data.success === false) {
          dispatch(updateUserFailure(data.message));
          toast.error("Error in Removing from Wishlist");
          return;
        }

        dispatch(updateUserSuccess(data.rest));
        setIsInWishlist(false);
        toast.success("Removed from Wishlist");
        return;
      } catch (error) {
        toast.error(error.response.data.message);
        return;
      }
    } else {
      // User is not logged in, handle wishlist with localStorage
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        updatedWishlist = JSON.parse(storedWishlist);
        // Remove event from wishlist
        updatedWishlist = updatedWishlist.filter((id) => id !== event._id);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setIsInWishlist(false);
        toast.success("Removed from Wishlist");
      }
    }
  };

  const handleAddToCalendar = (calendar) => {
    const calendarEvent = {
      title: event.Title + `(${event.StartTime})`,
      description: event.description,
      start: event.Date,
      allDay: true,
    };

    let calendarLink;
    if (calendar === "google") {
      calendarLink = google(calendarEvent);
    } else if (calendar === "outlook") {
      calendarLink = outlook(calendarEvent);
    }

    if (calendarLink) {
      window.open(calendarLink);
    }
  };

  let IndRupee = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  useEffect(() => {}, [randomEvents]);
  let eventDate;
  switch (event.DateType) {
    case "Single":
      eventDate = formatDate(event.Date);
      break;
    case "Multi":
      eventDate = startToEndDateFormat(event.StartDate, event.EndDate);
      break;
    case "Recurring":
      eventDate =
        event.RecurringPattern === "Specific Day"
          ? `Every ${event.RecurringDay}`
          : "Every Weekend";
      break;
    default:
      eventDate = formatDate(event.Date);
  }
  return (
    <>
      <Helmet>
        <title>{`${event.Title} - Best Events in ${event.City} | Find Your Vibe`}</title>
        <meta name="description" content={event.description} />
        <link
          rel="canonical"
          href={`https://findyourvibe.in/event/${event.postedBy}`}
        />
      </Helmet>

      <div className="bg-white dark:bg-black dark:text-white gap-8 text-black min-h-screen flex flex-col items-center justify-center">
        <ScrollRestoration />

        <div className="relative w-full h-[500px]">
          {/* <!-- Background Image --> */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${event.Image[1]})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md"></div>
          </div>

          {/* <!-- Foreground Image --> */}
          <img
            className="relative rounded-b-full md:rounded-none w-full h-full object-contain"
            src={event.Image[1]}
            alt={event.Title}
          />
        </div>

        <div className="w-full px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 -mt-24 md:mt-0 z-10 border bg-white dark:bg-dullBlack dark:shadow-lg dark:border-0 p-4 rounded-lg md:rounded-2xl">
              <div className="flex mb-3 justify-between items-center">
                <h2 className="text-xl md:text-3xl font-bold">{event.Title}</h2>
                <button className="p-2">
                  {isInWishlist ? (
                    <IoMdHeart
                      size={30}
                      color="red"
                      onClick={deleteFromWishList}
                    />
                  ) : (
                    <IoMdHeartEmpty
                      size={30}
                      color="red"
                      onClick={addToWishList}
                    />
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 md:flex-row mb-4 items-start justify-between md:items-center">
                <div className="flex items-center text-xs">
                  <BsCalendar2Date className="mr-2" />
                  <p>{eventDate}</p>
                  {/* <p>, {event.StartTime} Hrs</p> */}
                </div>
                <p className="text-xs">
                  {event.Price === "Free"
                    ? "Free"
                    : event.Price === "Fixed-price"
                      ? IndRupee.format(event.EventCost)
                      : event.Price === "Check-in"
                        ? "Pay at Check-in"
                        : event.Price === "Paid"
                          ? `Starts at ${
                              event.tickets?.length > 0 &&
                              event.tickets[0]?.price
                                ? IndRupee.format(event.tickets[0].price)
                                : "N/A"
                            }`
                          : IndRupee.format(event.Price)}
                </p>

                <div className="flex items-center">
                  <div className="flex items-center text-xs">
                    <GoClock className="mr-2" />
                    {/* <p> {formatDate(event.Date)}</p> */}
                    <p>{event.StartTime}</p>
                  </div>
                </div>

                {/* <div className="flex items-center text-xs">
                  <IoLocationOutline className="mr-2" />
                  <p>
                    {event.City}, {event.State}
                  </p>
                </div> */}
              </div>
              <hr />
              <p className="mt-6 mb-4 text-xs md:text-sm">
                <span className="font-semibold">Address: </span>
                <span>{event.Location}</span>
              </p>

              {/* Description */}
              <div className="flex gap-3 mb-4">
                <p className="text-xs md:text-sm whitespace-pre-wrap">
                  <span className="font-semibold whitespace-nowrap text-xs md:text-sm">
                    Event Details:{" "}
                  </span>
                  <br />
                  {showFullDescription
                    ? event.description
                    : `${event.description.slice(0, 150)}...`}
                  {event.description.length > 150 && (
                    <span
                      className="text-black font-semibold dark:text-primary cursor-pointer ml-1"
                      onClick={toggleDescription}
                    >
                      {showFullDescription ? " Read less" : " Read more"}
                    </span>
                  )}
                </p>
              </div>
              <hr />
              <TicketPage event={event} user={currentUser} />
              {/* <h2 className="mt-4 text-xl font-semibold">About the organiser</h2>
            <div className="flex gap-2 items-center text-xs my-4">
              <img
                className="w-12 h-12 object-cover rounded-full"
                src={organizer.avatar}
                alt="..."
              />
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold">{organizer.username}</h2>
                <p>{formatDate(event.postingDate)}</p>
              </div>
            </div> */}
            </div>

            <div className="w-full md:w-1/2 border dark:border-0 h-fit bg-white dark:bg-dullBlack dark:shadow-lg p-4 rounded-lg md:rounded-2xl">
              <div className="flex flex-col md:flex-row h-fit gap-2 items-center">
                {/* <p>{formatDate(event.Date)}</p> */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    event.Location,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-dullBlack dark:bg-secondary w-full md:w-auto flex justify-center md:block p-3 rounded-md text-primary underline"
                >
                  {/* View Location on Map */}
                  <TbLocationFilled color="white" size={20} />
                </a>
                <Distance location={event.Location} />
              </div>
              <Map coordinates={event.coordinates} address={event.Location} />

              <div className="flex flex-col md:flex-row w-full mt-4 gap-3">
                <Share
                  className=""
                  description={
                    "Hey, I came across this fascinating event on findyourvibe.in. Here's the link"
                  }
                />

                <div className="flex md:w-1/2 gap-3 md:flex-col flex-row  items-center justify-between p-4 bg-dullBlack dark:border-primary dark:border text-white/50 rounded-md h-auto">
                  <p className="text-xs md:text-base">Add to calendar:</p>
                  <div className="flex">
                    <button
                      className="p-1"
                      onClick={() => handleAddToCalendar("google")}
                    >
                      <FaGoogle color="white" size={28} />
                    </button>
                    <span className="hidden md:block"></span>
                    <button
                      className="p-1"
                      onClick={() => handleAddToCalendar("outlook")}
                    >
                      <PiMicrosoftOutlookLogoDuotone color="white" size={28} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="w-full mt-8 px-4 md:px-8 md:my-8 my-8">
          {randomEvents.length > 0 && (
            <>
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-semibold mb-4">Similar Events</h2>
                <Link
                  to="/explore"
                  className="border border-black text-black dark:border-primary dark:text-primary px-4 py-2 rounded-lg text-sm"
                >
                  Find more
                </Link>
              </div>
              <div className="">
                {randomEvents.map((event) => (
                  <div
                    className="inline-block align-top w-full sm:w-1/2 lg:w-1/4 p-2"
                    key={event._id}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div> */}
      </div>
    </>
  );
};

export default Event;
