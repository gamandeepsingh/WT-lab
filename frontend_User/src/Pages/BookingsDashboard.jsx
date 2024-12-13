import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import DashboardNavbar from "../components/DashboardNavbar";
import { ScrollRestoration } from "react-router-dom";
import useEvents from "../hooks/useEvents";
import useBookings from "../hooks/useBookings";

const BookingsDashboard = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [events] = useEvents();
  const [orders = []] = useBookings(currentUser._id);
  console.log(orders);

  useEffect(() => {
    if (orders !== undefined) {
      setLoading(false);
    }
  }, [orders]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const canGoNext = endIndex < orders.length;
  const canGoPrev = currentPage > 1;

  const formatDate = (dateString) => {
    const bookingDate = new Date(dateString);
    const timestamp = bookingDate * 1000;
    const date = new Date(timestamp);
    const day = date.toLocaleString("en-IN", { day: "numeric" });
    const month = date.toLocaleString("en-IN", { month: "short" });
    const year = date.toLocaleString("en-IN", { year: "numeric" });
    return `${day} ${month}, ${year}`;
  };

  return (
    <div>
      <ScrollRestoration />
      <div className="min-h-screen bg-white dark:bg-black mx-auto p-4 relative">
        <DashboardNavbar />
        <h1 className="text-xl font-bold text-white">All Bookings</h1>
        <div className="xl:px-16 px-4 dark:bg-black bg-white dark:text-white text-black">
          {loading ? (
            <Loader />
          ) : (
            <section className="py-1">
              <div className="w-full mb-12 xl:mb-0 px-4 mx-auto mt-5">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
                  <div className="rounded-t mb-0 md:px-4 py-3 bg-white dark:bg-dullBlack border border-black dark:border-white border-b-0">
                    <div className="flex flex-wrap items-center">
                      <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-blueGray-700">
                          My Bookings
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="block w-full overflow-x-auto">
                    <table className="items-center bg-bg-secondary border border-black dark:border-white w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-black dark:border-white py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Booking ID
                          </th>
                          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-black dark:border-white py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Amount
                          </th>
                          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-black dark:border-white py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            User Phone
                          </th>
                          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-black dark:border-white py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            User Email
                          </th>
                          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-black dark:border-white py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Booked at
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .slice(startIndex, endIndex)
                          .map((order, index) => (
                            <tr key={order._id}>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.notes.receipt || order.order_id}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                ₹{order.amount / 100}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.contact}
                              </td>
                              <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {order.email}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 capitalize">
                                {formatDate(order.created_at)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Pagination */}
              <div className="m-2 flex justify-end gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={!canGoPrev}
                  className={`bg-black dark:bg-primary hover:scale-110 transition-all duration-300 text-white dark:text-black py-2 px-6 rounded-full ${
                    !canGoPrev ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <IoIosArrowBack className="inline-block mr-1" />
                  Prev
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={!canGoNext}
                  className={`bg-black dark:bg-primary hover:scale-110 transition-all duration-300 text-white dark:text-black py-2 px-6 rounded-full ${
                    !canGoNext ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Next
                  <IoIosArrowForward className="inline-block ml-1" />
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsDashboard;
