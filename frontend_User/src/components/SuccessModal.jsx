import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessModal = ({ showModal, message, onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate("/contact-support");
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-custom_white dark:bg-darkSecondary text-text dark:text-white md:w-1/3 w-full p-4 md:p-6 rounded-lg shadow-lg">
        <p className="text-base  mb-4">{message}</p>
        <button
          onClick={handleClose}
          className="mt-4 px-3 py-2 bg-primary dark:bg-dullBlack text-black dark:text-white rounded-md w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
