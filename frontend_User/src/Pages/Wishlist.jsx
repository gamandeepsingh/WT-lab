import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/EventCard";
import useEvents from "../hooks/useEvents";
import axios from "axios";
import { useDispatch } from "react-redux";
import { PiSmileySadThin } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";
import { updateUserSuccess } from "../redux/user/userSlice";
import Loader from "../components/Loader";
import { Link, ScrollRestoration } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const Wishlist = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [fetchedEvents, loading] = useEvents();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `/api/user/get-user/${currentUser.email}`
        );
        const { password, ...userData } = userResponse.data;
        dispatch(updateUserSuccess(userData));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (fetchedEvents) {
      let filteredEvents = fetchedEvents;
      if (currentUser) {
        filteredEvents = fetchedEvents.filter((event) =>
          currentUser.wishList.includes(event._id)
        );
      } else {
        const storedWishlist = localStorage.getItem("wishlist");
        if (storedWishlist) {
          const wishlistIds = JSON.parse(storedWishlist);

          filteredEvents = fetchedEvents.filter((event) =>
            wishlistIds.includes(event._id)
          );
        } else {
          filteredEvents = [];
        }
      }
      setEvents(filteredEvents);
    }
  }, [currentUser, fetchedEvents]);

  const handleEmptyWishlist = async () => {
    try {
      if (currentUser) {
        const response = await axios.delete(
          `/api/user/empty-wishlist/${currentUser._id}`
        );
        const data = response.data;
        setEvents([]);
        dispatch(updateUserSuccess(data.rest));
      } else {
        localStorage.removeItem("wishlist");
        setEvents([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page-content bg-white dark:bg-black">
      <ScrollRestoration />

      <div className="dark:bg-black bg-white  min-h-screen text-black dark:text-white">
        <div className="flex justify-between items-center mx-4 md:mx-12">
          <h1 className="text-3xl font-semibold z-10 text-center">
            Interested Events
          </h1>
          <button
            disabled={events.length === 0}
            onClick={handleEmptyWishlist}
            className={`flex items-center dark:bg-secondary bg-black text-xs text-white dark:text-white p-4 rounded-full hover:bg-primary hover:text-black ${
              events.length === 0 && "cursor-not-allowed"
            }`}
          >
            <FaTrash className="" />
          </button>
        </div>

        <div className="flex justify-center p-4">
          {events.length === 0 && (
            <div className="h-96 gap-4 flex flex-col justify-center items-center">
            <p className="text-center flex gap-2 justify-center flex-col items-center">
              <PiSmileySadThin size={100} /> No Events Found in your
              Wishlist!
            </p>
            <Link to={`/explore`} className="">
      <button className="flex gap-2 items-center border border-black bg-transparent text-black dark:border-0 hover:bg-black hover:text-white dark:bg-primary dark:text-black px-4 py-2 rounded-md text-xs">Explore All Events<IoIosArrowForward size={15} /></button></Link>
      </div>
          )}
        </div>
        <div className="px-2 md:px-12">
          {events.map((event) => (
            <div className="inline-block align-top w-full sm:w-1/2 lg:w-1/4 p-2" key={event._id}>
            <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
