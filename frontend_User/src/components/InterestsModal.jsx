import React from "react";
import { typeOptions } from "../constants";

const InterestsModal = ({
  selectedInterests,
  handleTypeChange,
  handleSave,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-dullBlack text-black dark:text-white md:w-1/3 w-3/4 p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-xl font-semibold p-2">
          Choose your Interests
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {typeOptions.map((type) => (
            <div
              key={type}
              onClick={() => handleTypeChange({ target: { value: type } })}
              className={`cursor-pointer p-4 rounded-lg shadow-md flex items-center justify-center ${
                selectedInterests.includes(type)
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
              }`}
            >
              {type}
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="bg-primary text-black px-4 py-2 rounded-md hover:opacity-80 mt-4 w-full"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default InterestsModal;
