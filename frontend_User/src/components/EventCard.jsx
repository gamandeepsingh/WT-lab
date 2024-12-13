import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsCalendar2Date } from "react-icons/bs";
import { IoPersonOutline, IoLocationOutline } from "react-icons/io5";
import { MdOutlineLocationOn } from "react-icons/md";
import { formatDate, startToEndDateFormat } from "../utils/Data";
import { useSelector, useDispatch } from "react-redux";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { toast } from "react-hot-toast";
import axios from "axios";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { GoClock } from "react-icons/go";

const EventCard = ({ event }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isInWishlist, setIsInWishlist] = useState(false);

  let IndRupee = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

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
    <Link to={`/event/${event._id}`}>
      <div
        className="  inline-block shadow-lg relative rounded-xl overflow-hidden w-68 aspect-square"
        // style={{ width: '300px', height: '400px' }}
      >
        <div className="bg-custom-gradient h-56 absolute bottom-0 w-full"></div>
        <img
          className="w-full h-full object-cover object-center"
          src={event.Image[0]}
          alt={event.Title}
        />
        <div className="m-2 text-white absolute top-0 right-0 bg-black/50 shadow-lg backdrop-blur-md p-2 text-xs rounded-full">
          <span className="text-white flex gap-2 items-center truncate">
            {isInWishlist ? (
              <button onClick={deleteFromWishList}>
                <IoMdHeart className="" size={20} color="white" />
              </button>
            ) : (
              <button onClick={addToWishList}>
                <IoMdHeartEmpty size={20} />
              </button>
            )}
          </span>
        </div>
        <div className="p-4 absolute bottom-0 flex flex-col justify-between w-full">
          <div>
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-white font-semibold text-lg truncate">
                {event.Title}
              </h2>
              <div className="flex items-center text-xs text-white">
                <GoClock className="mr-1" />
                {/* <p> {formatDate(event.Date)}</p> */}
                <p>{event.StartTime}</p>
              </div>
            </div>
            {/* <p className="mt-2 text-white text-sm line-clamp-3">
              {event.description}
            </p> */}
          </div>
          <div className="space-y-1 text-xs">
            <div className="mt-3 flex items-center justify-between">
              <span className="text-white flex gap-2 items-center">
                <BsCalendar2Date />
                {eventDate}
              </span>

              <p className="text-xs text-white">
                {event.Price === "Free"
                  ? "Free"
                  : event.Price === "Fixed-price"
                    ? IndRupee.format(event.EventCost)
                    : event.Price === "Check-in"
                      ? "Pay at Check-In"
                      : event.Price === "Paid"
                        ? `Starts at ${
                            event.tickets?.length > 0 && event.tickets[0]?.price
                              ? IndRupee.format(event.tickets[0].price)
                              : "N/A"
                          }`
                        : IndRupee.format(event.Price)}
              </p>
            </div>
            <div className="flex justify-between">
              {/* <span className="text-white flex gap-2 items-center truncate">
              <MdOutlineLocationOn />
              {event.City}
            </span> */}
            </div>
          </div>
        </div>
        {/* <div className="bg-primary rounded-t-3xl px-4 py-2 absolute bottom-0 z-10">Book now</div> */}
      </div>
    </Link>
  );
};

export default EventCard;
