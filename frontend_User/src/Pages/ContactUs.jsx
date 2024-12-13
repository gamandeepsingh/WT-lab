import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import { ScrollRestoration, useNavigate } from "react-router-dom";

const ContactUs = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();

    const name = formRef.current.name.value;
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      toast.error("Please enter a valid name");
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAIL_JS_SERVICE_ID,
        import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID_USER_SUPPORT,
        formRef.current,
        import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY
      );
      toast.success("Message Sent Successfully");
      formRef.current.reset();
    } catch (error) {
      toast.error("Error in Sending Message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white bg-opacity-80 dark:bg-black   flex  justify-center p-4">
      <ScrollRestoration />
      <div className="max-w-md w-full h-1/2 mt-8 bg-white dark:bg-dullBlack text-black dark:text-white  rounded-lg shadow-lg p-8 ">
        <p className="">
          <button
            onClick={() => navigate(-1)}
            className="flex text-xs mb-2 md:text-sm  items-center justify-start"
          >
            <IoIosArrowBack />
            Back
          </button>
        </p>
        <h1 className="text-4xl font-bold text-center mb-6  ">Contact US</h1>
        <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
          <div className="space-y-4">
            <input
              autoComplete="on"
              name="name"
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border text-gray-700  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary "
              required
            />
            <input
              autoComplete="on"
              name="mail"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border text-gray-700  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary "
              required
            />
            <textarea
              autoComplete="on"
              name="message"
              placeholder="Write your query here"
              rows={4}
              className="w-full px-4 py-2 border text-gray-700  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary "
              required
            />
            <button
              name="submit"
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 text-white bg-secondary rounded-md hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary  ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
