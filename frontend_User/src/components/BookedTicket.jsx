import React, { useRef } from "react";
// import html2canvas from "html2canvas";
import FYV from "../assets/FYV-poster.png";

const BookedTicket = ({ closeModal, event, orderData }) => {
  // const ticketRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  // const handleDownload = () => {
  //   if (!ticketRef.current) {
  //     console.error(
  //       "Invalid element: ticketRef is not attached to a valid DOM element",
  //     );
  //     return;
  //   }
  //   setTimeout(() => {
  //     html2canvas(ticketRef.current, { useCORS: true, logging: true })
  //       .then((canvas) => {
  //         const link = document.createElement("a");
  //         link.download = "ticket.png";
  //         link.href = canvas.toDataURL("image/png");
  //         link.click();
  //       })
  //       .catch((err) => {
  //         console.error("Error capturing the element: ", err);
  //       });
  //   }, 300);
  // };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 text-black">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <img src={FYV} className="w-[20%]" />
          <button
            className="text-gray-500 focus:outline-none"
            onClick={closeModal}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Ticket Details */}
        <div className="p-4">
          {" "}
          {/* Added ref here */}
          <img
            src={event.Image[1]}
            className="h-[18vh] w-full object-cover mb-4"
          />
          <div className="flex justify-between items-center">
            <span>
              <p className="text-gray-600 text-xs">Ticket Booked 🎉</p>
              <h3 className="text-lg font-bold">{event.Title}</h3>
            </span>
            <span className="text-xs py-[2px] px-4 border border-green-600 bg-green-200 rounded-3xl">
              Paid
            </span>
          </div>
          <hr className="border-t-2 border-dotted my-4" />
          <div>
            <p className="text-gray-600 text-xs">Receipt ID</p>
            <p className="text-sm font-black">{orderData[0].data.receipt}</p>
            <div className="flex my-3 w-[95%] justify-between">
              <span>
                <p className="text-gray-600 text-xs">Name</p>
                <p className="text-sm font-black">{orderData[0].username}</p>
              </span>
              <span className="text-right">
                <p className="text-gray-600 text-xs">Location</p>
                <p className="text-sm font-black">{event.City}</p>
              </span>
            </div>
            <div className="flex my-3 w-[95%] justify-between">
              <span>
                <p className="text-gray-600 text-xs">Date</p>
                <p className="text-sm font-black">{event.Date}</p>
              </span>
              <span className="text-right">
                <p className="text-gray-600 text-xs">Time</p>
                <p className="text-sm font-black">{event.StartTime}</p>
              </span>
            </div>
          </div>
          <hr className="border-t-2 border-dotted my-4" />
          <div className="mt-4 flex items-center justify-between text-left w-[95%]">
            <span>
              <p className="text-gray-600 text-xs">Your Tickets</p>
              <p className="text-xs font-black">{orderData[0].tickets}</p>
            </span>
            <p className="font-bold mt-2 text-sm">
              ₹ {orderData[0].data.amount / 100}
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
  );
};

export default BookedTicket;
