import React, { useEffect, useState } from "react";
import axios from "axios";
import OfferCard from "../components/OfferCard";
import Loader from "../components/Loader";

const AllOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get("/api/offer/all-offers");
        setOffers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching offers:", error);
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const displayedOffers = offers.filter((offer) => offer.status === "approved");

  return (
    <div className="min-h-screen bg-white dark:bg-black dark:text-white text-black p-4">
      {loading ? (
        <Loader />
      ) : (
        <div className="">
          {displayedOffers.map((offer) => (
              <div className="inline-block align-top w-full sm:w-1/2 lg:w-1/4 p-2 offerPage" key={offer._id}>
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOffers;
