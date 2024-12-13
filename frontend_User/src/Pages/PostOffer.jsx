import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { MdCloudUpload } from "react-icons/md";
import { ScrollRestoration } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { validateInput } from "../constants";
import OfferPoster from "../components/OfferPoster";
import { updateUserSuccess } from "../redux/user/userSlice";
import SuccessModal from "../components/SuccessModal";

const PostOffer = () => {
  const dispatch = useDispatch();
  const allowedImageFormats = ["jpg", "jpeg", "png", "webp"];
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const currentDate = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);
  const [postingOffer, setPostingOffer] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    postedBy: currentUser.email,
    Date: currentDate,
  });
  const formRef = useRef(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
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
      setFormData({
        ...formData,
        [id]: value,
      });
    }
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
      setPostingOffer(false);
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
      toast.error("Please upload the image");
      return;
    }
    setPostingOffer(true);
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
      setPostingOffer(false);
      return;
    }
    if (uploadedFiles.images.length === 0) {
      setPostingOffer(false);
      return;
    }
    try {
      const response = await axios.post(`/api/offer/post-offer`, {
        ...formData,
        Image: uploadedFiles.images,
      });
      if (response.data.acknowledged) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.log(formData);
      console.log(uploadedFiles.images);
      console.error("Error posting offer:", error);
      toast.error("Failed to post offer");
    } finally {
      formRef.current.reset();
      setFile(null);
      fileInputRef.current.value = null;
      setPostingOffer(false);
    }
  };

  return (
    <div className="page-content bg-white dark:bg-black">
      <ScrollRestoration />
      {showSuccessModal && (
        <SuccessModal
          showModal={showSuccessModal}
          message="Congratulations! The offer has been posted successfully! It will be confirmed by the admin within 24 hours."
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      <h2 className="text-black dark:text-white mx-4 text-2xl font-semibold flex flex-col">
        Post New Offer <hr className="mt-2 border-gray-400" />
      </h2>
      <div className="p-5 bg-white dark:bg-black dark:text-white flex flex-col-reverse md:flex-row  gap-4 text-black  min-h-screen ">
        {postingOffer && <Loader />}
        <OfferPoster formData={formData} file={file} />
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 md:w-1/2"
        >
          <div className="grid md:grid-cols-2 gap-4">
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
                htmlFor="Date"
                className="block text-sm font-medium required"
              >
                Expiry Date:
              </label>
              <input
                onClick={(e) => e.target.showPicker()} // Ensure date picker shows on click
                type="date"
                id="Date"
                name="Date"
                min={currentDate} // Set min attribute to current date
                onChange={handleChange}
                required
                value={formData.Date}
                className={`mt-1 p-2 w-full border border-gray-400 placeholder:text-black dark:placeholder:text-white text-xs rounded-md bg-transparent
                  ${errors.Date ? "border-red-500" : ""}
                  `}
              />

              {errors.Date && (
                <p className="text-red-500 text-xs italic">{errors.Date}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4">
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
                      and only <strong>jpg, png, jpeg, webp</strong> format allowed.                    
                      Use <strong>1080x1080 px</strong> for perfect
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
          </div>

          <button
            disabled={postingOffer}
            type="submit"
            className={`border border-black dark:border-none w-full rounded-lg dark:bg-primary bg-black text-white dark:text-black py-2 px-4 ${
              postingOffer ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {postingOffer ? "Uploading Details..." : "Post Offer"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default PostOffer;
