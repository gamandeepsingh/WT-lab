import React, { useState } from "react";
import { BsCalendar2Date } from "react-icons/bs";
import { formatDate } from "../utils/Data";
import { AiOutlineClose } from "react-icons/ai";

const OfferCard = ({ offer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-background") {
      handleCloseModal();
    }
  };

  return (
    <>
      <div
        className="shadow-lg relative rounded-xl overflow-hidden mt-3 w-full aspect-square xl:w-[19rem] 2xl:aspect-[25/38] cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="bg-custom-gradient h-56 absolute bottom-0 w-full"></div>
        <img
          className="w-full h-full object-cover object-center"
          src={offer.Image[0]}
          alt={offer.Title}
        />
        <div className="textBox p-4 absolute bottom-0 flex flex-col justify-between w-full">
          <div>
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-white font-semibold text-lg truncate">
                {offer.Title}
              </h2>
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="mt-3 flex items-center justify-between">
              <span className="text-white flex gap-2 items-center">
                <BsCalendar2Date /> Valid till {formatDate(offer.Date)}
              </span>
            </div>
            <div className="flex justify-between"></div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          id="modal-background"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOutsideClick}
        >
          <div className="relative">
            <img
              className="object-contain h-[80vh] md:h-[80vh] max-w-[80vw]"
              src={offer.Image[0]}
              alt={offer.Title}
            />
            <button
              className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-70 rounded-full p-1"
              onClick={handleCloseModal}
            >
              <AiOutlineClose />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OfferCard;
