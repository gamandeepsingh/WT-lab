import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { loadStates, loadCities, geocodeAddress } from "../utils/Data";
import { MdCloudUpload } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { ScrollRestoration } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { typeOptions, languages, validateInput } from "../constants";
import Poster from "../components/Poster";
import { updateUserSuccess } from "../redux/user/userSlice";
import Places from "../components/Places";
import SuccessModal from "../components/SuccessModal";
import CreateTicketModal from "../components/CreateTicketModal";

const PostEvent = () => {
  const dispatch = useDispatch();
  const allowedImageFormats = ["jpg", "jpeg", "png", "webp"];
  const { currentUser } = useSelector((state) => state.user);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const fileInputRef = useRef(null);
  const file2InputRef = useRef(null);
  const currentDate = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);
  const [postingEvent, setPostingEvent] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    postedBy: currentUser.email,
    StartTime: currentTime,
    Type: "",
    City: "",
    State: "",
    language: "",
    Price: "",
    EventCost: "",
    tickets: [],
    postedByMobile: currentUser.phoneNo,
    // Date
    DateType: "Single",
    // Date: currentDate,
    // StartDate: "",
    // EndDate: "",
    // RecurringPattern: "",
    // RecurringDay: "",
    // ExpiryDate: "",
  });
  const formRef = useRef(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState({
    name: "",
    price: "",
    limitedEntry: false,
    seats: "",
    seatValue: "",
    description: "",
  });

  useEffect(() => {
    if (showSuccessModal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showSuccessModal]);

  // Update User on reload
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `/api/user/get-user/${currentUser.email}`
        );
        const { password, ...userData } = userResponse.data;
        dispatch(updateUserSuccess(userData));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (Object.keys(formData).some((key) => !!formData[key])) {
        event.preventDefault();
        event.returnValue =
          "Are you sure you want to leave? You have unsaved changes.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formData]);

  // Fetch States
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const states = await loadStates();
        states.sort((a, b) => a[1].localeCompare(b[1]));

        setStates(states);
      } catch (error) {
        console.error("Error loading states:", error);
      }
    };

    fetchStates();
  }, []);

  // Fetch Cities based on State
  useEffect(() => {
    const fetchCities = async () => {
      const code = states.filter((state) => state[1] === formData.State);

      if (formData.State) {
        try {
          const cities = await loadCities(code[0][0]);
          setCities(cities);
        } catch (error) {
          console.error("Error loading cities:", error);
        }
      }
    };

    fetchCities();
  }, [formData.State]);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleFile2Change = (event) => {
    const uploadedFile = event.target.files[0];
    setFile2(uploadedFile);
  };

  const handleRemoveFile = (fileType) => {
    if (fileType === "Image") {
      setFile(null);
      fileInputRef.current.value = null;
    } else if (fileType === "Image2") {
      setFile2(null);
      file2InputRef.current.value = null;
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const errorMessage = validateInput(id, value);
    setErrors({
      ...errors,
      [id]: errorMessage,
    });
    if (!errorMessage || value === "") {
      setErrors({
        ...errors,
        [id]: "",
      });
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
        ...(id === "DateType" && value === "Single"
          ? {
              Date: currentDate,
              StartDate: "",
              EndDate: "",
              RecurringPattern: "",
              RecurringDay: "",
              ExpiryDate: currentDate,
            }
          : {}),
        ...(id === "DateType" && value === "Multi"
          ? { Date: "", StartDate: "", EndDate: "" }
          : {}),
        ...(id === "DateType" && value === "Recurring"
          ? {
              Date: "",
              RecurringPattern: "Every Weekend",
              ExpiryDate: "",
            }
          : {}),
      }));
    }
  };

  const onLocationChange = (formattedAddress, state, city) => {
    setFormData((formData) => ({
      ...formData,
      Location: formattedAddress,
      State: state || formData.State,
      City: city || formData.City,
    }));
  };

  const handlePriceChange = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      Price: event.target.value, // Handle MCQ selection
    }));
  };
  const handleTicketDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTicketDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTicket = () => {
    const { name, price, limitedEntry, seats, seatValue, description } =
      ticketDetails;
    if (
      !name ||
      !price ||
      !description ||
      !seatValue ||
      (limitedEntry && !seats)
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      tickets: [...prevFormData.tickets, ticketDetails],
    }));
    setTicketDetails({
      name: "",
      price: "",
      limitedEntry: false,
      seatValue: "",
      seats: "",
      description: "",
    });
    setShowTicketModal(false);
  };

  const handleRemoveTicket = (indexToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tickets: prevFormData.tickets.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleEditTicket = (indexToEdit) => {
    const ticketToEdit = formData.tickets[indexToEdit];
    setTicketDetails(ticketToEdit);
    setShowTicketModal(true);
    // Remove the ticket from the list, so when updated, it adds as a new one.
    handleRemoveTicket(indexToEdit);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const url = `/api/user/upload`;

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      setPostingEvent(false);
      throw new Error("Error uploading file");
    }
  };

  const handleFileValidationAndUpload = async (
    file,
    allowedFormats,
    type,
    maxSizeInBytes
  ) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedFormats.includes(fileExtension)) {
      toast.error(
        `Invalid ${type} file format. Please select a valid ${type} file.`
      );
      return null;
    }

    if (file.size > maxSizeInBytes) {
      toast.error(`Image File size exceeds the limit of 4MB`);
      return null;
    }

    return await uploadFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    if (!file) {
      toast.error("Please upload a cover image");
      return;
    }

    setPostingEvent(true);
    let uploadedFiles = {
      images: [],
    };

    const uploadedFile1 = await handleFileValidationAndUpload(
      file,
      allowedImageFormats,
      "image",
      4000 * 1024
    );
    if (uploadedFile1) {
      uploadedFiles.images.push(uploadedFile1);
    } else {
      setPostingEvent(false);
      return;
    }

    if (file2) {
      const uploadedFile2 = await handleFileValidationAndUpload(
        file2,
        allowedImageFormats,
        "image",
        4000 * 1024
      );
      if (uploadedFile2) {
        uploadedFiles.images.push(uploadedFile2);
      } else {
        setPostingEvent(false);
        return;
      }
    } else {
      uploadedFiles.images.push(uploadedFile1);
    }

    if (uploadedFiles.images.length === 0) {
      setPostingEvent(false);
      return;
    }

    try {
      const { latitude, longitude } = await geocodeAddress(formData.Location);
      let expiryDate =
        formData.DateType === "Recurring"
          ? formData.ExpiryDate || ""
          : formData.DateType === "Single"
          ? formData.Date
          : formData.EndDate;

      const eventData = {
        DateType: formData.DateType,
        ...(formData.DateType === "Single" && {
          Date: formData.Date,
          ExpiryDate: expiryDate,
        }),
        ...(formData.DateType === "Multi" && {
          StartDate: formData.StartDate,
          EndDate: formData.EndDate,
          ExpiryDate: expiryDate,
        }),
        ...(formData.DateType === "Recurring" && {
          RecurringPattern: formData.RecurringPattern,
          ...(formData.RecurringPattern === "Specific Day" && {
            RecurringDay: formData.RecurringDay,
          }),
          ExpiryDate: expiryDate,
        }),
        seatingCapCounter: formData.seatingCapacity,
        Image: uploadedFiles.images,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
        ...formData,
      };
      const response = await axios.post(`/api/event/post-event`, eventData);
      console.log(eventData);
      if (response.data.acknowledged) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error posting event:", error);
      toast.error("Failed to post event");
    } finally {
      formRef.current.reset();
      setFile(null);
      fileInputRef.current.value = null;
      setFile2(null);
      file2InputRef.current.value = null;
      setPostingEvent(false);
    }
  };

  return (
    <div className="page-content bg-white dark:bg-black">
      <ScrollRestoration />
      {showSuccessModal && (
        <SuccessModal
          showModal={showSuccessModal}
          message="Congratulations! The event has been posted successfully!
Your event will be confirmed by the admin within 24 hours."
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      <h2 className="text-black dark:text-white mx-4 text-2xl font-semibold flex flex-col">
        Post New Event <hr className="mt-2 border-gray-400" />
      </h2>
      <div className="p-5 bg-white dark:bg-black dark:text-white flex flex-col-reverse md:flex-row  gap-4 text-black  min-h-screen ">
        {postingEvent && <Loader />}
        <Poster formData={formData} file={file} />
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 md:w-1/2"
        >
          <div className="grid md:md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="Title"
                className="block text-sm font-medium required"
              >
                Title:
              </label>
              <input
                type="text"
                id="Title"
                name="Title"
                placeholder="Enter Title"
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-black dark:placeholder:text-white text-xs rounded-md bg-transparent "
              />
            </div>
            <div>
              <label
                htmlFor="Location"
                className="block text-sm font-medium required"
              >
                Venue:
              </label>

              <Places onLocationChange={onLocationChange} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="State"
                className="block text-sm font-medium required"
              >
                State:
              </label>
              <select
                id="State"
                name="State"
                onChange={handleChange}
                value={formData.State}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs rounded-md bg-transparent "
              >
                <option className="bg-dullBlack text-white" value="">
                  Select State
                </option>
                {states.map((option, index) => (
                  <option
                    className="bg-dullBlack text-white"
                    key={`${option[0]}-${index}`}
                    value={option[1]}
                  >
                    {option[1]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="City"
                className="block text-sm font-medium required"
              >
                City:
              </label>
              <select
                id="City"
                name="City"
                onChange={handleChange}
                value={formData.City}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs rounded-md bg-transparent "
              >
                <option className="bg-dullBlack text-white" value="">
                  Select City
                </option>
                {cities.map((option, index) => (
                  <option
                    className="bg-dullBlack text-white"
                    key={`${option[0]}-${index}`}
                    value={option[1]}
                  >
                    {option[1]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="StartTime"
                className="block text-sm font-medium required"
              >
                Start Time:
              </label>

              <input
                id="StartTime"
                name="StartTime"
                onChange={handleChange}
                value={formData.StartTime}
                onClick={(e) => e.target.showPicker()}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-black dark:placeholder:text-white text-xs rounded-md bg-transparent"
                type="time"
              />
            </div>
            <div>
              <label
                htmlFor="Type"
                className="block text-sm font-medium required"
              >
                Choose Language:
              </label>
              <select
                id="language"
                name="language"
                onChange={handleChange}
                value={formData.language}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs rounded-md bg-transparent "
              >
                <option className="bg-dullBlack text-white" value="">
                  Select language
                </option>
                {languages.map((option) => (
                  <option
                    className="bg-dullBlack text-white"
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="Type"
                className="block text-sm font-medium required"
              >
                Type:
              </label>
              <select
                id="Type"
                name="Type"
                onChange={handleChange}
                value={formData.Type}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs rounded-md bg-transparent "
              >
                <option className="bg-dullBlack text-white" value="">
                  Select Type
                </option>
                {typeOptions.map((option) => (
                  <option
                    className="bg-dullBlack text-white"
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="DateType"
                className="block text-sm font-medium required"
              >
                Date Type:
              </label>
              <select
                id="DateType"
                value={formData.DateType}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs rounded-md bg-transparent"
              >
                <option className="bg-dullBlack text-white" value="Single">
                  Single Date
                </option>
                <option className="bg-dullBlack text-white" value="Multi">
                  Multi Date
                </option>
                <option className="bg-dullBlack text-white" value="Recurring">
                  Recurring Date
                </option>
              </select>
            </div>
            {formData.DateType === "Single" && (
              <div>
                <label
                  htmlFor="Date"
                  className="block text-sm font-medium required"
                >
                  Date:
                </label>
                <input
                  type="date"
                  onClick={(e) => e.target.showPicker()}
                  id="Date"
                  min={currentDate}
                  value={formData.Date}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-400 placeholder:text-black dark:placeholder:text-white text-xs rounded-md bg-transparent"
                />
              </div>
            )}

            {formData.DateType === "Multi" && (
              <div>
                <label
                  htmlFor="StartDate"
                  className="block text-sm font-medium required"
                >
                  Start Date:
                </label>
                <input
                  type="date"
                  onClick={(e) => e.target.showPicker()}
                  id="StartDate"
                  min={currentDate}
                  value={formData.StartDate}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-400 placeholder:text-black dark:placeholder:text-white text-xs rounded-md bg-transparent"
                />
                <label
                  htmlFor="EndDate"
                  className="block text-sm font-medium required mt-2"
                >
                  End Date:
                </label>
                <input
                  type="date"
                  onClick={(e) => e.target.showPicker()}
                  id="EndDate"
                  min={formData.StartDate}
                  value={formData.EndDate}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-400 placeholder:text-black dark:placeholder:text-white text-xs rounded-md bg-transparent"
                />
              </div>
            )}

            {formData.DateType === "Recurring" && (
              <div>
                <label
                  htmlFor="RecurringPattern"
                  className="block text-sm font-medium required"
                >
                  Recurring Pattern:
                </label>
                <select
                  id="RecurringPattern"
                  value={formData.RecurringPattern}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-400 placeholder:text-black dark:placeholder:text-white text-xs rounded-md bg-transparent"
                >
                  <option
                    className="bg-dullBlack text-white"
                    value="Every Weekend"
                  >
                    Every Weekend
                  </option>
                  <option
                    className="bg-dullBlack text-white"
                    value="Specific Day"
                  >
                    Specific Day
                  </option>
                </select>

                {formData.RecurringPattern === "Specific Day" && (
                  <div>
                    <label
                      htmlFor="RecurringDay"
                      className="block text-sm font-medium required mt-2"
                    >
                      Recurring Day:
                    </label>
                    <select
                      id="RecurringDay"
                      value={formData.RecurringDay}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border border-gray-400 placeholder:text-black dark:placeholder:text-white text-xs rounded-md bg-transparent"
                    >
                      <option
                        className="bg-dullBlack text-white"
                        value="Sunday"
                      >
                        Sunday
                      </option>
                      <option
                        className="bg-dullBlack text-white"
                        value="Monday"
                      >
                        Monday
                      </option>
                      <option
                        className="bg-dullBlack text-white"
                        value="Tuesday"
                      >
                        Tuesday
                      </option>
                      <option
                        className="bg-dullBlack text-white"
                        value="Wednesday"
                      >
                        Wednesday
                      </option>
                      <option
                        className="bg-dullBlack text-white"
                        value="Thursday"
                      >
                        Thursday
                      </option>
                      <option
                        className="bg-dullBlack text-white"
                        value="Friday"
                      >
                        Friday
                      </option>
                      <option
                        className="bg-dullBlack text-white"
                        value="Saturday"
                      >
                        Saturday
                      </option>
                    </select>
                  </div>
                )}

                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="hasEndDate"
                    className="appearance-auto"
                    checked={formData.ExpiryDate !== ""}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        ExpiryDate: formData.ExpiryDate ? "" : currentDate,
                      })
                    }
                  />
                  <label
                    htmlFor="hasEndDate"
                    className="text-sm font-medium ml-2"
                  >
                    Does it have an end date?
                  </label>
                </div>
                {formData.ExpiryDate && (
                  <input
                    type="date"
                    id="ExpiryDate"
                    min={formData.StartDate || currentDate}
                    value={formData.ExpiryDate}
                    onChange={handleChange}
                    onClick={(e) => e.target.showPicker()}
                    className="mt-1 p-2 w-full border border-gray-400 placeholder:text-black dark:placeholder:text-white text-xs rounded-md bg-transparent"
                  />
                )}
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="seatingCapacity"
                className="block text-sm font-medium"
              >
                Seating Capacity (leave if none):
              </label>
              <input
                type="number"
                onChange={handleChange}
                id="seatingCapacity"
                name="seatingCapacity"
                className={`mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs rounded-md bg-transparent md:text-sm  `}
              />
            </div>
            <div>
              <label
                htmlFor="Price"
                className="block text-sm font-medium required"
              >
                Price:
              </label>
              <div className="flex gap-4 ">
                <select
                  id="Price"
                  name="Price"
                  value={formData.Price}
                  onChange={handlePriceChange}
                  required
                  className={` mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs rounded-md bg-transparent md:text-sm  ${
                    errors.Price ? "border-red" : ""
                  }`}
                  style={{
                    background:
                      "url('data:image/svg+xml,<svg height=\\'10px\\' width=\\'10px\\' viewBox=\\'0 0 16 16\\' fill=\\'%23b8d21e\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\\'/></svg>') no-repeat",
                    backgroundPosition: "calc(100% - 0.75rem) center",
                  }}
                >
                  <option value="" disabled>
                    Select Pricing
                  </option>
                  <option value="Free">Free</option>
                  <option value="Check-in">Check-in</option>
                  <option value="Fixed-price">Paid Non Booking</option>
                  <option value="Paid">Paid Booking</option>
                </select>
              </div>
              {errors.Price && (
                <p className="text-red-500 text-xs italic">{errors.Price}</p>
              )}
            </div>
          </div>
          {formData.Price === "Fixed-price" && (
            <div>
              <div className="mt-4">
                <label
                  htmlFor="EventCost"
                  className="block text-sm font-medium required"
                >
                  Event Price:
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={formData.EventCost}
                  id="EventCost"
                  name="EventCost"
                  className={`mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs rounded-md bg-transparent md:text-sm  `}
                />
              </div>
            </div>
          )}
          {formData.Price === "Paid" && (
            <div className="gap-4">
              <div>
                <div className="mt-4">
                  <label className="block text-sm font-medium required">
                    Create Ticket:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(true)}
                    className="px-4 py-2 bg-green-600 text-white mt-1 p-2 w-[20%] text-xs rounded-md md:text-sm"
                  >
                    Add
                  </button>
                  <div className="mt-4 space-y-2">
                    {formData.tickets.map((ticket, index) => (
                      <div
                        key={index}
                        className="relative p-4 border border-gray-400 dark:border-white rounded-md bg-transparent"
                      >
                        <h4 className="text-sm font-semibold">
                          {ticket.name} Ticket: ₹{ticket.price}
                        </h4>
                        <p className="text-xs line-clamp-2">
                          {ticket.description}
                        </p>
                        {ticket.limitedEntry && (
                          <p className="text-xs">
                            Seats Available: {ticket.seats}
                          </p>
                        )}
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button
                            onClick={() => handleEditTicket(index)}
                            className="text-blue-500"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleRemoveTicket(index)}
                            className="text-red-500"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {showTicketModal && (
            <CreateTicketModal
              ticketDetails={ticketDetails}
              handleTicketDetailChange={handleTicketDetailChange}
              handleAddTicket={handleAddTicket}
              setTicketDetails={setTicketDetails}
              setShowTicketModal={setShowTicketModal}
            />
          )}
          <div className="gap-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium required"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                rows={10}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white text-xs rounded-md bg-transparent "
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs italic">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Image 1 */}
            <div className="p-3 rounded-md bg-transparent dark:bg-dullBlack border-black border relative">
              {file && (
                <div
                  className="rounded-lg py-2 px-4"
                  style={{
                    backgroundImage: `url(${URL.createObjectURL(file)})`,
                    backgroundSize: "cover",
                    height: "200px", // Adjust the height as needed
                    width: "100%", // Set the width to fill the container
                  }}
                >
                  <button
                    className="absolute top-2 right-2 text-black bg-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                    onClick={() => handleRemoveFile("Image")}
                  >
                    &times;
                  </button>
                </div>
              )}
              {!file && (
                <label htmlFor="Image" className="cursor-pointer">
                  <div className="dark:text-white text-black flex items-center justify-center flex-col rounded-lg py-2 px-4 cursor-pointer">
                    <MdCloudUpload size={130} />
                    <h2 className="font-semibold text-2xl">
                      Upload Cover Image
                      <span className="text-red-500">&#42;</span>
                    </h2>
                    <p className="text-xs mt-2 text-center">
                      Size must be less than <strong>4MB </strong>
                      and only <strong>jpg, png, jpeg, webp</strong> format
                      allowed. Use <strong>1080x1080 px</strong> for perfect
                      resolution
                    </p>
                  </div>
                </label>
              )}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                id="Image"
                name="Image"
                className="border rounded-lg py-2 px-4 mt-3 w-full hidden"
              />
            </div>
            {/* Image 2 */}
            <div className="p-3 rounded-md bg-transparent dark:bg-dullBlack  dark:border-white border-black relative">
              {file2 && (
                <div
                  className="rounded-lg py-2 px-4"
                  style={{
                    backgroundImage: `url(${URL.createObjectURL(file2)})`,
                    backgroundSize: "cover",
                    height: "200px", // Adjust the height as needed
                    width: "100%", // Set the width to fill the container
                  }}
                >
                  <button
                    className="absolute top-2 right-2 text-black bg-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                    onClick={() => handleRemoveFile("Image2")}
                  >
                    &times;
                  </button>
                </div>
              )}
              {!file2 && (
                <label htmlFor="Image2" className="cursor-pointer">
                  <div className="dark:text-white flex items-center justify-center flex-col rounded-lg p-4 cursor-pointer">
                    <MdCloudUpload size={130} />
                    <h1 className="font-semibold text-2xl">
                      Upload Banner Image
                    </h1>
                    <p className="text-sm">
                      Image size must be less than <strong>4MB</strong>
                    </p>
                    <p className="text-sm">
                      Only <strong>jpg, png</strong> format allowed
                    </p>
                  </div>
                </label>
              )}
              <input
                ref={file2InputRef}
                type="file"
                onChange={handleFile2Change}
                id="Image2"
                name="Image2"
                className="border rounded-lg py-2 px-4 mt-3 w-full hidden"
              />
            </div>
          </div>

          <button
            disabled={postingEvent}
            type="submit"
            className={`border border-black dark:border-none w-full rounded-lg dark:bg-primary bg-black text-white dark:text-black py-2 px-4 ${
              postingEvent ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {postingEvent ? "Uploading Details..." : "Post Event"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default PostEvent;
