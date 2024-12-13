import React from "react";
import useEvents from "../hooks/useEvents";
import FYV from "../assets/FYV-poster.png";

const MyBookingsCard = ({ booking }) => {
  const [events] = useEvents();
  const booked_event_id = booking.notes.event_id;
  const booking_receipt = booking.notes.receipt || booking.order_id;
  const booked_event = events.find((event) => event._id === booked_event_id);
  // console.log("booked: ", booked_event.Image[0]);

  const bookingDate = new Date(booking.created_at);
  const timestamp = bookingDate * 1000;
  const date = new Date(timestamp);
  const day = date.toLocaleString("en-IN", { day: "numeric" });
  const month = date.toLocaleString("en-IN", { month: "short" });
  const year = date.toLocaleString("en-IN", { year: "numeric" });
  const bookedDate = `${day} ${month}, ${year}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  return (
    <>
      {booked_event ? (
        <div className="flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full text-black">
            <div className="flex justify-between items-center p-4 border-b">
              <img src={FYV} className="w-[20%]" />
            </div>
            <div className="p-4">
              <img
                src={booked_event?.Image?.[0]}
                className="h-[18vh] w-full object-cover mb-4"
              />
              <div className="flex justify-between items-center">
                <span>
                  <p className="text-gray-600 text-xs">Ticket Booked 🎉</p>
                  <h3 className="text-lg font-bold">{booked_event?.Title}</h3>
                </span>
                <span className="text-xs py-[2px] px-4 border border-green-600 bg-green-200 rounded-3xl">
                  Paid
                </span>
              </div>
              <hr className="border-t-2 border-dotted my-4" />
              <div>
                <p className="text-gray-600 text-xs">Receipt ID</p>
                <p className="text-sm font-black">{booking_receipt}</p>
                <div className="flex my-3 w-[95%] justify-between">
                  <span>
                    <p className="text-gray-600 text-xs">Booked on</p>
                    <p className="text-sm font-black">{bookedDate}</p>
                  </span>
                  <span className="text-right">
                    <p className="text-gray-600 text-xs">Location</p>
                    <p className="text-sm font-black">{booked_event?.City}</p>
                  </span>
                </div>
                <div className="flex my-3 w-[95%] justify-between">
                  <span>
                    <p className="text-gray-600 text-xs">Event Date</p>
                    <p className="text-sm font-black">
                      {formatDate(booked_event?.Date)}
                    </p>
                  </span>
                  <span className="text-right">
                    <p className="text-gray-600 text-xs">Time</p>
                    <p className="text-sm font-black">
                      {booked_event?.StartTime}
                    </p>
                  </span>
                </div>
              </div>
              <hr className="border-t-2 border-dotted my-4" />
              <div className="mt-4 flex items-center justify-between text-left w-[95%]">
                <span>
                  <p className="text-gray-600 text-xs">Your Tickets</p>
                  <p className="text-xs font-black">{booking.description}</p>
                </span>
                <p className="font-bold mt-2 text-sm">
                  ₹ {booking.amount / 100}
                </p>
              </div>
              <div className="text-center mt-6">
                <p className="text-xs text-gray-500">
                  Cancellation not available for this venue
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full text-black">
            <div className="flex justify-between items-center p-4 border-b">
              <img src={FYV} className="w-[20%]" />
            </div>
            <div className="p-4">
              {/* <img src={""} className="h-[18vh] w-full object-cover mb-4" /> */}
              <div className="flex justify-between items-center">
                <span>
                  <p className="text-gray-600 text-xs">Ticket Booked 🎉</p>
                  <h3 className="text-lg font-bold">Not Available</h3>
                </span>
                <span className="text-xs py-[2px] px-4 border border-green-600 bg-green-200 rounded-3xl">
                  Paid
                </span>
              </div>
              <hr className="border-t-2 border-dotted my-4" />
              <div>
                <p className="text-gray-600 text-xs">Receipt ID</p>
                <p className="text-sm font-black">{booking_receipt}</p>
                <div className="flex my-3 w-[95%] justify-between">
                  <span>
                    <p className="text-gray-600 text-xs">Booked on</p>
                    <p className="text-sm font-black">{bookedDate}</p>
                  </span>
                  <span className="text-right">
                    <p className="text-gray-600 text-xs">Location</p>
                    <p className="text-sm font-black">Not Available</p>
                  </span>
                </div>
                <div className="flex my-3 w-[95%] justify-between">
                  <span>
                    <p className="text-gray-600 text-xs">Event Date</p>
                    <p className="text-sm font-black">Not Available</p>
                  </span>
                  <span className="text-right">
                    <p className="text-gray-600 text-xs">Time</p>
                    <p className="text-sm font-black">Not Available</p>
                  </span>
                </div>
              </div>
              <hr className="border-t-2 border-dotted my-4" />
              <div className="mt-4 flex items-center justify-between text-left w-[95%]">
                <span>
                  <p className="text-gray-600 text-xs">Your Tickets</p>
                  <p className="text-xs font-black">{booking.description}</p>
                </span>
                <p className="font-bold mt-2 text-sm">
                  ₹ {booking.amount / 100}
                </p>
              </div>
              <div className="text-center mt-6">
                <p className="text-xs text-gray-500">
                  Cancellation not available for this venue
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyBookingsCard;
