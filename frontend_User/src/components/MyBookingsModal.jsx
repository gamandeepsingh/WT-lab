import React from "react";
import { formatDate } from "../utils/Data";

const MyBookingsModal = ({ isOpen, onClose, eventsWithBookings, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-dullBlack text-white rounded-lg w-full max-w-5xl mx-4 lg:mx-auto p-6 overflow-auto max-h-full relative h-[85vh] md:h-auto shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-3xl font-bold mb-6 text-white">Event Bookings</h2>

        {/* Loader when bookings are still being fetched */}
        {loading ? (
          <div className="flex justify-center items-center gap-2">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-400 h-6 w-6"></div>
            <p className="text-gray-400">Loading bookings...</p>
          </div>
        ) : eventsWithBookings.length > 0 ? (
          eventsWithBookings.map((event) => (
            <div key={event._id} className="mb-8">
              <div className="flex justify-between items-baseline md:items-center mb-4 flex-col md:flex-row">
                <h3 className="text-2xl font-semibold">{event.Title}</h3>
                <p className="text-sm text-gray-400">
                  Tickets Left: {event.seatingCapCounter}
                </p>
                <p className="text-sm text-gray-400">
                  Posted on: {formatDate(event.postingDate)}
                </p>
              </div>

              {/* Looping through bookings */}
              <div className="space-y-4">
                {event.bookings.map((booking, idx) => (
                  <div
                    key={booking.id}
                    className="rounded-lg p-4 cursor-pointer border border-white dark:border-primary dark:border bg-dullBlack dark:bg-transparent"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-gray-100">
                        Booking #{idx + 1}
                      </h4>
                      <span className="text-sm text-gray-400">
                        ₹{booking.amount / 100}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Order ID</span>
                        <span className="text-xs text-white">
                          {booking.order_id}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Email</span>
                        <span className="text-xs text-white">
                          {booking.email}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Contact</span>
                        <span className="text-xs text-white">
                          {booking.contact}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">
                          Payment Method
                        </span>
                        <span className="text-xs text-white">
                          {booking.method}
                        </span>
                      </div>
                      <div className="flex flex-col sm:col-span-2">
                        <span className="text-xs text-gray-400">
                          Ticket Bought
                        </span>
                        <span className="text-xs text-white">
                          {booking.description}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No bookings available for any events.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookingsModal;
