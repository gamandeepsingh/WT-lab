import { useState, useEffect } from "react";
import LOGO from "../assets/fyv-nav.png";
import { PiBookmarksSimpleFill, PiMapPinFill } from "react-icons/pi";
import axios from "axios";
import BookedTicket from "./BookedTicket";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function TicketPage({ event, user }) {
  const location = useLocation();
  // const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  // const [myData, setMyData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const handleRedir = () => {
    Cookies.set("redirectPath", location.pathname, { expires: 1 });
  };

  useEffect(() => {
    const body = document.body;
    const handlePopState = () => {
      if (isModalOpen) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      body.classList.add("no-scroll");
      window.addEventListener("popstate", handlePopState);
    } else {
      body.classList.remove("no-scroll");
      window.removeEventListener("popstate", handlePopState);
    }

    return () => {
      body.classList.remove("no-scroll");
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isModalOpen]);

  const handleOpenModal = async () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTicketClose = () => {
    setPaymentSuccess(false);
    document.body.classList.remove("no-scroll");
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    document.body.classList.add("no-scroll");
    setIsModalOpen(false);
  };

  const calcTotalTickets = (tickets) => {
    let sum = null;
    tickets.map((e) => {
      if (e.seats !== null) {
        sum += e.seats;
      }
    });
    return sum;
  };

  return (
    <div>
      {event.seatingCapCounter === 0 ||
      calcTotalTickets(event.tickets) === 0 ? (
        <button
          className="cursor-not-allowed mt-4 flex gap-2 items-center bg-gray-400 text-white px-10 py-3 rounded-md text-xs"
          disabled
        >
          Sold Out
        </button>
      ) : event.Price === "Paid" ? (
        currentUser ? (
          <button
            className="cursor-pointer mt-4 flex gap-2 items-center bg-dullBlack text-white dark:bg-primary dark:text-black px-10 py-3 rounded-md text-xs"
            onClick={handleOpenModal}
          >
            Get Tickets
          </button>
        ) : (
          <Link
            to="/sign-in"
            onClick={handleRedir}
            className="w-fit cursor-pointer mt-4 flex gap-2 items-center bg-red-500 text-white dark:bg-primary dark:text-black px-10 py-3 rounded-md text-xs"
          >
            Login to book
          </Link>
        )
      ) : null}

      {/* Modal */}
      {isModalOpen && (
        <TicketModal
          handleCloseModal={handleCloseModal}
          event={event}
          user={user}
          onPaymentSuccess={handlePaymentSuccess}
          setOrderData={setOrderData}
        />
      )}
      {paymentSuccess && (
        <BookedTicket
          event={event}
          orderData={orderData}
          closeModal={handleTicketClose}
        />
      )}
    </div>
  );
}

function TicketModal({
  handleCloseModal,
  event,
  user,
  onPaymentSuccess,
  setOrderData,
}) {
  const [selectedTickets, setSelectedTickets] = useState([]); // Track selected tickets
  const [ticketQuantities, setTicketQuantities] = useState({}); // Track quantity of seats for each ticket
  const seatingCapCounter = event.seatingCapCounter;
  const { id } = useParams();
  const [myData, setMyData] = useState([]);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const response = await axios.get(`/api/event/all-events/${id}`);
        console.log(response.data); // gives data
        setMyData(response.data);
        console.log(myData); // blank array
      } catch (error) {
        console.error("Error: Its ticket error", error);
      }
    };
    fetchMyData();
  }, [id]);

  useEffect(() => {
    console.log("state updated: ", myData);
  }, [myData]);

  const handleTicketSelection = (ticket) => {
    setSelectedTickets((prevSelectedTickets) =>
      prevSelectedTickets.includes(ticket._id)
        ? prevSelectedTickets.filter((selected) => selected !== ticket._id)
        : [...prevSelectedTickets, ticket._id],
    );
  };

  const handleQuantityChange = (ticket, quantity) => {
    setTicketQuantities((prevQuantities) => ({
      ...prevQuantities,
      [ticket._id]: Number(quantity),
    }));
  };

  // calculate total price accordinng to ticket pricing & qty
  const calculateTotal = () => {
    return selectedTickets.reduce((total, ticketId) => {
      const ticket = event.tickets.find((t) => t._id === ticketId);
      const quantity = ticketQuantities[ticketId] || 1; // Default quantity is 1 if none selected
      return total + ticket.price * quantity;
    }, 0);
  };

  // calculate total ticket occupancy based on qty & ticket type
  const calculateInventoryCount = () => {
    return selectedTickets.reduce((totalInventory, ticketId) => {
      const ticket = event.tickets.find((t) => t._id === ticketId);
      const quantity = ticketQuantities[ticketId] || 1; // Default quantity is 1 if none selected
      return totalInventory + ticket.seatValue * quantity;
    }, 0);
  };

  const selectedTicketName = () => {
    const selectedTicketTitles = selectedTickets
      .map((ticketId) => {
        const ticket = event.tickets.find((t) => t._id === ticketId);
        const quantity = ticketQuantities[ticketId] || 1; // Default quantity is 1 if none selected
        return ticket ? `${ticket.name} (x ${quantity})` : null;
      })
      .filter((name) => name !== null); // Filter out null values
    return selectedTicketTitles.join(", "); // Return comma-separated string of ticket names
  };

  const updateTicketInventory = async (eventId, newSeatingCapacity) => {
    try {
      const response = await axios.patch(
        `/api/event/${eventId}/updateTicketInventory`,
        {
          newSeatingCapacity: seatingCapCounter - newSeatingCapacity,
        },
      );
    } catch (error) {
      console.error("Error updating seating capacity:", error);
    }
  };

  const updateTicketCount = async (eventId, ticketQuantities) => {
    try {
      const response = await axios.patch(
        `/api/event/${eventId}/updateTicketInventory`,
        {
          ticketQuantities,
        },
      );
      console.log("Ticket inventory updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating ticket inventory:", error);
    }
  };

  const initPay = (data, event, user) => {
    const selectedNames = selectedTicketName();
    const prefill = {
      email: user.email || "",
    };
    if (user.phoneNo) {
      prefill.contact = user.phoneNo;
    }
    const options = {
      key: import.meta.env.VITE_RAZORPAY,
      amount: data.amount,
      currency: data.currency,
      name: event.Title,
      description: selectedNames,
      image: event.Image[1],
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyURL = "/api/payment/verify-order";
          const { rzp_ids } = await axios.post(verifyURL, {
            razorpay_orderID: response.razorpay_order_id,
            razorpay_paymentID: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          console.log("Payment verified:");
          handleCloseModal();
          const orderData = [
            {
              username: user.name,
              tickets: selectedNames,
              data: data,
            },
          ];
          setOrderData(orderData);
          onPaymentSuccess();
          // updateTicketInventory(event._id, calculateInventoryCount());
          updateTicketCount(event._id, ticketQuantities);
          sendPaymentConfirmationEmail(user, event, selectedNames, data);
        } catch (error) {
          console.error("Error verifying payment:", response);
        }
      },
      prefill: prefill,
      notes: {
        user_id: user._id,
        event_id: event._id,
        receipt: data.receipt,
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePay = async (event, user) => {
    try {
      // if (
      //   seatingCapCounter !== null &&
      //   calculateInventoryCount() > seatingCapCounter
      // ) {
      //   alert(`Sorry, Only ${seatingCapCounter} tickets left`);
      //   return;
      // }
      console.log(ticketQuantities);
      const orderURL = "/api/payment/create-order";
      const { data } = await axios.post(orderURL, {
        amount: calculateTotal(),
        eventTitle: event.Title,
      });
      console.log(data.data);
      initPay(data.data, event, user);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const sendPaymentConfirmationEmail = async (
    user,
    event,
    selectedNames,
    data,
  ) => {
    try {
      console.log(data);
      await axios.post("/api/payment/send-email", {
        email: user.email,
        username: user.name,
        event: event,
        tickets: selectedNames,
        amount: data.amount,
        id: data.receipt,
      });
    } catch (error) {
      console.error("Error verifying payment or sending email:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="dark:bg-secondary bg-white w-full max-w-md lg:max-w-lg h-full md:h-auto md:max-h-[90vh] rounded-md overflow-y-auto relative">
        {/* Modal Header */}
        <div className="border-b-[0.5px] border-gray-200 flex items-center justify-between bg-dullBlack p-3 sticky top-0 z-[100]">
          <img src={LOGO} className="w-[20%]" />
          <button
            className="text-2xl text-white"
            onClick={() => handleCloseModal()}
          >
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:h-auto mb-20">
          {/* Event Details */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xl md:text-3xl font-bold mb-4">
                {event.Title}
              </p>
              <div className="flex gap-1 items-center mb-1 opacity-80">
                <PiMapPinFill />
                <p className="font-semibold text-xs md:text-sm">{event.City}</p>
              </div>
              <div className="flex gap-1 items-center mb-1 opacity-80">
                <PiBookmarksSimpleFill />
                <p className="font-semibold text-xs md:text-sm">
                  {formatDate(event.Date)}
                </p>
              </div>
            </div>
            <div
              className="h-20 w-20 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url(${event.Image[1]})`,
              }}
            ></div>
          </div>

          {/* Select Tickets Section */}
          <h3 className="text-md font-semibold mb-4 mt-8">
            Select Tickets{" "}
            <span className="text-black/50 dark:text-white/50 text-xs">
              ({selectedTickets.length} selected)
            </span>
          </h3>

          {/* Render tickets dynamically */}

          {myData && myData.tickets && myData.tickets.length > 0
            ? myData.tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className={`p-4 rounded-md cursor-pointer dark:border-primary dark:border ${
                    selectedTickets.includes(ticket._id)
                      ? "bg-green-600 dark:bg-[#4e5a01]"
                      : "bg-dullBlack dark:bg-transparent"
                  } mb-6`}
                >
                  <div className="flex justify-between items-center text-black dark:text-white">
                    <div>
                      <h4 className="font-bold text-white dark:text-inherit">
                        {ticket.name}
                      </h4>
                      <p className="text-sm mt-2 text-white/70">
                        {ticket.description}
                      </p>
                      <button
                        className={`cursor-pointer flex gap-2 items-center px-4 py-1 mt-2 rounded-md text-xs
                    ${
                      selectedTickets.includes(ticket._id)
                        ? "bg-white text-dullBlack dark:bg-red-500 dark:text-white"
                        : "bg-white text-dullBlack dark:bg-primary dark:text-black"
                    }`}
                        onClick={() => handleTicketSelection(ticket)}
                        disabled={ticket.seats === 0}
                      >
                        {ticket.seats === 0
                          ? "Stock Out"
                          : selectedTickets.includes(ticket._id)
                            ? "Remove"
                            : "Add"}
                      </button>
                    </div>
                    <div className="flex items-end gap-1 flex-col w-full">
                      {ticket.limitedEntry && (
                        <span className="text-xs text-white/60">
                          Seats: {ticket.seats}
                        </span>
                      )}
                      <span className="font-bold text-md text-white dark:text-inherit">
                        ₹{ticket.price}
                      </span>
                      <select
                        className="text-sm bg-no-repeat bg-right appearance-none text-left w-[60%] md:w-[50%] bg-transparent px-3 py-1 rounded-md text-white dark:text-inherit border border-white dark:border-primary"
                        onChange={(e) =>
                          handleQuantityChange(ticket, e.target.value)
                        }
                        style={{
                          background:
                            "url('data:image/svg+xml,<svg height=\\'10px\\' width=\\'10px\\' viewBox=\\'0 0 16 16\\' fill=\\'%23fff\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\\'/></svg>') no-repeat",
                          backgroundPosition: "calc(100% - 0.75rem) center",
                        }}
                      >
                        <option value="" disabled selected>
                          Choose Qty
                        </option>
                        {Array.from(
                          { length: Math.min(5, ticket.seats ?? 5) },
                          (_, index) => (
                            <option key={index + 1} value={index + 1}>
                              {index + 1}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>

        {/* Sticky Footer for Proceed Button */}
        <div className="bg-dullBlack p-4 border-t-[0.5px] border-gray-200 fixed w-full max-w-md lg:max-w-lg bottom-0 z-[100]">
          <div className="flex justify-between items-center">
            <p className="text-white text-md font-bold">
              Subtotal: ₹{calculateTotal()}
            </p>
            <button
              onClick={() => handlePay(event, user)}
              className="cursor-pointer flex gap-2 items-center bg-white text-dullBlack dark:bg-primary dark:text-black px-10 py-3 rounded-md text-xs"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
