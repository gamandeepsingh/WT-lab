import React from "react";
import PosterCardOffer from "./PosterCardOffer";
import { FaTimes } from "react-icons/fa";

const OfferModal = ({ selectedOffer, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-dullBlack text-black dark:text-white md:w-1/3 w-100 p-6 rounded-lg shadow-lg  ">
        <button onClick={onClose} className=" text-red-500">
          <FaTimes />
        </button>
        <div className=" w-[80vw] md:w-[60vw]">
          <PosterCardOffer formData={selectedOffer} file={null} />
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
