import React, { useEffect, useState, useMemo } from "react";
import { Link, ScrollRestoration } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import OfferModal from "../components/OfferModal";
import Loader from "../components/Loader";
import { formatDate } from "../utils/Data";
import toast from "react-hot-toast";
import DashboardNavbar from "../components/DashboardNavbar";

const OffersDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [offers, setOffers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(`/api/offer/myOffers/${currentUser.email}`)
      .then((res) => {
        const sortedOffers = res.data;
        setOffers(sortedOffers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the offers!", error);
      });
  }, [currentUser.email]);

  const filteredOffers = (
    searchText
      ? offers.filter((offer) =>
          offer.Title.toLowerCase().includes(searchText.toLowerCase()),
        )
      : offers
  ).sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));
  // console.log(filteredOffers);

  const handleSearch = () => {
    // Fetch data again if needed
    if (!searchText) {
      console.log("seearch hit");
      fetch(`/api/offer/myOffers/${currentUser.email}`)
        .then((res) => res.json())
        .then((data) => {
          setOffers(data);
        });
    }
  };

  const handleDelete = async (offerId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this offer listing?",
    );
    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `/api/offer/deleteOffer/${offerId}`,
        );
        if (response.data.acknowledged === true) {
          setOffers((prevOffers) =>
            prevOffers.filter((offer) => offer._id !== offerId),
          );
          toast.success("Offer deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting offer:", error);
      }
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const canGoNext = endIndex < filteredOffers.length;
  const canGoPrev = currentPage > 1;

  return (
    <div>
      <ScrollRestoration />
      <div className="min-h-screen bg-white dark:bg-black mx-auto p-4 relative">
        <DashboardNavbar />
        {offerModalOpen && (
          <OfferModal
            selectedOffer={selectedOffer}
            onClose={() => setOfferModalOpen(false)}
          />
        )}
        <div className="xl:px-16 dark:bg-black bg-white dark:text-white text-black">
          <div className="flex justify-center w-full items-center md:flex-row flex-col md:gap-0 gap-4 p-4">
            <div className="relative flex items-center w-full max-w-md">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search your offer here..."
                className="block flex-1 focus:outline-primary rounded-md py-3 pl-4 placeholder:text-black bg-black/5 dark:bg-white/20 backdrop-blur-md placeholder:dark:text-white placeholder:text-xs focus:right-0 font-poppins sm:text-sm sm:leading-6"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button
                className="absolute bg-black dark:bg-primary p-2 rounded-md cursor-pointer right-2 text-white dark:text-black"
                // onClick={handleSearch}
              >
                <FiSearch size={15} />
              </button>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <section className="py-1">
              <div className="w-full mb-12 xl:mb-0 px-4 mx-auto mt-5">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
                  <div className="rounded-t mb-0 md:px-4 py-3 bg-white dark:bg-dullBlack border border-black dark:border-white border-b-0">
                    <div className="flex flex-wrap items-center">
                      <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-blueGray-700">
                          All Offers
                        </h3>
                      </div>
                      <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                        <Link to="/post-offer">
                          <button
                            className="bg-black dark:bg-primary px-4 whitespace-nowrap py-2 md:py-3 md:px-8 dark:text-black text-white active:bg-secondary text-xs font-bold uppercase rounded-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                          >
                            POST NEW OFFER
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="block w-full overflow-x-auto">
                    <table className="items-center bg-bg-secondary border border-black dark:border-white w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-black dark:border-white py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            NO.
                          </th>
                          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-black dark:border-white py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            TITLE
                          </th>
                          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-black dark:border-white py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            POSTING DATE
                          </th>
                          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-black dark:border-white py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            OFFER EXPIRY
                          </th>
                          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-black dark:border-white py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            VIEW POSTER
                          </th>
                          <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-black dark:border-white py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            DELETE
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOffers
                          .slice(startIndex, endIndex)
                          .map((offer, index) => (
                            <tr key={index}>
                              <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                                {startIndex + index + 1}
                              </th>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {offer.Title}
                              </td>
                              <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {formatDate(offer.postingDate)}
                              </td>
                              <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {formatDate(offer.Date)}
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <button
                                  onClick={() => {
                                    setSelectedOffer(offer);
                                    setOfferModalOpen(true);
                                  }}
                                  className="bg-transparent hover:bg-primary hover:text-custom_white text-black dark:text-white border border-solid border-black dark:border-white py-2 px-4 rounded"
                                >
                                  View Poster
                                </button>
                              </td>
                              <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <button
                                  onClick={() => handleDelete(offer._id)}
                                  className="                                bg-transparent hover:bg-red-600 text-black dark:text-white border border-solid border-black dark:border-white py-2 px-4 rounded"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    className={`bg-black dark:bg-primary hover:scale-110 transition-all duration-300 text-white dark:text-black py-2 px-6 rounded-full ${
                      !canGoPrev ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={goToPrevPage}
                    disabled={!canGoPrev}
                  >
                    <IoIosArrowBack className="inline-block mr-1" />
                    Prev
                  </button>
                  <span>
                    Page {currentPage} of{" "}
                    {Math.ceil(filteredOffers.length / itemsPerPage)}
                  </span>
                  <button
                    className={`bg-black dark:bg-primary hover:scale-110 transition-all duration-300 text-white dark:text-black py-2 px-6 rounded-full ${
                      !canGoNext ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={goToNextPage}
                    disabled={!canGoNext}
                  >
                    Next <IoIosArrowForward className="inline-block ml-1" />
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default OffersDashboard;
