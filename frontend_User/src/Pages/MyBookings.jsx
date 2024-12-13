import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import MyBookingsCard from "../components/MyBookingsCard";

const MyBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `/api/payment/user/${currentUser._id}/bookings`,
        );
        setBookings(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings: ", err);
        setError("Failed to fetch bookings");
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchBookings();
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-white dark:bg-black dark:text-white text-black p-4">
      <h2 className="text-black dark:text-white mx-4 text-2xl font-semibold flex flex-col">
        My Bookings <hr className="mt-2 border-gray-400" />
      </h2>

      {loading ? (
        <p className="mx-4 text-sm mt-4">Loading...</p>
      ) : error ? (
        <p className="mx-4 text-sm mt-4">{error}</p>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center gap-4 m-4">
          {bookings.map((booking, index) => (
            <div key={index} className="">
              <MyBookingsCard booking={booking} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mx-4 text-sm mt-4">No bookings found.</p>
      )}
    </div>
  );
};

export default MyBookings;
