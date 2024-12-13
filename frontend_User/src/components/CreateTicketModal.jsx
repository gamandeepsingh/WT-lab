import React from "react";

const CreateTicketModal = ({
  ticketDetails,
  handleTicketDetailChange,
  handleAddTicket,
  setTicketDetails,
  setShowTicketModal,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-dullBlack bg-opacity-75 z-[99]">
      <div className="bg-white dark:bg-dullBlack p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Ticket</h2>
        <div className="mb-4">
          <label className="block text-sm mb-2">Enter Name of Ticket:</label>
          <input
            type="text"
            name="name"
            value={ticketDetails.name}
            onChange={handleTicketDetailChange}
            className="w-full px-3 py-2 rounded-md bg-transparent text-xs text-dullBlack dark:text-white border border-primary focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2">Enter Price of Ticket:</label>
          <input
            type="number"
            name="price"
            value={ticketDetails.price}
            onChange={handleTicketDetailChange}
            className="w-full px-3 py-2 rounded-md bg-transparent text-xs text-dullBlack dark:text-white border border-primary focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2">
            Does this ticket have limited entry?
          </label>
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <input
                type="checkbox"
                name="limitedEntry"
                checked={ticketDetails.limitedEntry}
                onChange={handleTicketDetailChange}
                className="mr-2 h-4 w-4 border border-primary rounded-xl text-green-600 bg-white focus:ring-green-600 checked:bg-green-600 checked:border-transparent"
              />
              <span className="text-xs">Select if Yes</span>
            </span>

            {ticketDetails.limitedEntry && (
              <span>
                <label className="block text-sm mb-2">
                  Enter number of seats:
                </label>
                <input
                  type="number"
                  name="seats"
                  value={ticketDetails.seats}
                  onChange={handleTicketDetailChange}
                  className="w-full px-3 py-2 rounded-md bg-transparent text-xs text-dullBlack dark:text-white border border-primary focus:outline-none"
                />
              </span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2 mt-1">
            Seat occupancy in 1 ticket:
          </label>
          <input
            type="number"
            name="seatValue"
            value={ticketDetails.seatValue}
            onChange={handleTicketDetailChange}
            className="w-full px-3 py-2 rounded-md bg-transparent text-xs text-dullBlack dark:text-white border border-primary focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2">
            Enter short description of Ticket:
          </label>
          <textarea
            name="description"
            value={ticketDetails.description}
            onChange={handleTicketDetailChange}
            className="w-full px-3 py-2 rounded-md bg-transparent text-xs text-dullBlack dark:text-white border border-primary focus:outline-none"
          ></textarea>
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleAddTicket}
            className="w-1/2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 mr-2"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => {
              setTicketDetails({
                name: "",
                price: "",
                limitedEntry: false,
                seats: "",
                description: "",
              });
              setShowTicketModal(false); // Close modal
            }}
            className="w-1/2 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketModal;
