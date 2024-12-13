import React, { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import {
  MdOutlineDateRange,
  MdPersonOutline,
  MdOutlineCategory,
} from "react-icons/md";
import {
  IoPricetagsOutline,
  IoLocationOutline,
  IoTimeOutline,
} from "react-icons/io5";
import logo from "../assets/image2.png";

const DEFAULT_IMAGE_URL =
  "https://assets.lummi.ai/assets/QmVVFMSiEtiwmUJrCA8RqoyLQsKyyXVhC8mpcg8GUjQMrE?auto=format&w=1500";

const PosterCardOffer = ({ formData, file }) => {
  const posterRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // New state for loading

  useEffect(() => {
    if (formData.Image) {
      const imageUrl = formData.Image[0].startsWith("http://")
        ? formData.Image[0].replace("http://", "https://")
        : formData.Image[0];
      setImage(imageUrl);
    }
  }, [formData.Image]);

  const downloadPoster = () => {
    if (posterRef.current) {
      setLoading(true); // Start loading
      htmlToImage
        .toBlob(posterRef.current)
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'poster.png';
          document.body.appendChild(anchor); // Append the anchor to the body
          anchor.click(); // Trigger a click on the anchor
          document.body.removeChild(anchor); // Remove the anchor from the body
          URL.revokeObjectURL(url); // Clean up the URL object
          setLoading(false); // End loading
        })
        .catch((error) => {
          console.error("Failed to generate poster:", error);
          setLoading(false); // End loading on error
        });
    }
  };

  return (
    <div className="md:w-1/2 w-full">
      <div className="border border-gray-300 relative" ref={posterRef}>
        <div
          className="absolute inset-0 bg-gray-200"
          style={{ zIndex: -1 }}
        ></div>
        <div className="flex items-center w-full text-xs md:text-sm aspect-[2.15/3] justify-center">
          {image ? (
            <img
              src={image}
              alt="Event"
              className="w-full z-10 h-full object-cover rounded-lg"
            />
          ) : file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Event"
              className="w-full z-10 h-full object-cover rounded-lg"
            />
          ) : (
            <img
              src={DEFAULT_IMAGE_URL}
              alt="Event"
              className="w-full z-10 h-full object-cover rounded-lg"
            />
          )}

          <div className="bg-primary absolute bottom-2 right-2 w-28 p-1 rounded-sm opacity-100 z-10 ">
            <img
              src={logo}
              alt="Watermark"
              className=""
            />
          </div>
        </div>
        <div className="text-center mt-4 absolute -top-4 bg-[#00000070] py-2 shadow-lg backdrop-blur-md w-full z-10">
          <h2 className="text-xl md:text-2xl font-bold text-[#fff]">
            {formData.Title}
          </h2>
          <div className="flex  flex-wrap justify-center mt-[0.5rem] mx-2 md:text-md text-xs">
            <p className="flex items-center gap-2 mx-2 text-[#fff]">
              Offer valid till <MdOutlineDateRange />
              {formData.Date}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={downloadPoster}
        disabled={loading}
        className={`mt-4 dark:bg-primary bg-black text-white dark:text-black py-2 px-4 rounded w-full
          ${loading ? "cursor-not-allowed" : "cursor-pointer"}
          `}
      >
        {loading ? (
          <span className="flex items-center justify-center opacity-50">
            Downloading...
          </span>
        ) : (
          "Download Poster"
        )}
      </button>
    </div>
  );
};

export default PosterCardOffer;
