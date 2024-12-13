import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import axios from "axios";
import { validateInput } from "../constants";
import toast from "react-hot-toast";


function ResetPassword() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [resendStatus, setResendStatus] = useState("");

  useEffect(() => {
    if (!email) {
      // Redirect to forgot password page if email is not provided
      navigate("/forgot-password");
    }
  }, [email, navigate]);

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
        [id]: "", // Reset error message when input becomes valid
      });
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post(
        `/api/auth/resend-otp`,
        { email },
        {
   
        }
      );
      setResendStatus("OTP sent successfully");
    } catch (error) {
      console.error("Error resending OTP:", error);
      setResendStatus("Error sending OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error !== "")) {
      return; // Stop form submission if there are errors
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: "Passwords do not match",
      });
      return;
    }

    try {
      const response = await axios.get(
        `/api/auth/verifyOTP?code=${formData.otp}`,
        {
   
        }
      );

      const data = response.data;
      const { status } = data;
      const newFormData = {
        password: formData.password,
      };
      if (status) {
        try {
          const res = await axios.post(
            `/api/auth/updatePassword/${email}`,
            newFormData,
            {
              headers: {
                "Content-Type": "application/json",
              },
       
            }
          );
          const responseData = res.data;
          if (responseData.success === false) {
            return;
          }

          toast.error("Password Reset Successfully");
          navigate("/sign-in");
        } catch (error) {
          console.log(error.message);

          toast.error("Error in updating Password");
        }
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      toast.error("Error verifying OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-darkPrimary dark:text-white  ">
      <div className="shadow-lg rounded p-8 max-w-md w-full bg-lightSecondary dark:bg-darkSecondary dark:text-white">
        <h1 className="text-3xl font-semibold text-center mb-6 text-primary">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-4">
            <label htmlFor="otp" className="sr-only">
              <strong>OTP</strong>
            </label>
            <input
              type="number"
              placeholder="Enter 6 digit OTP received on your mail"
              autoComplete="off"
              name="otp"
              id="otp"
              required
              className={`appearance-none block w-full border rounded py-3 px-4 leading-tight text-black focus:outline-none ${
                errors.otp ? "border-red" : ""
              }`}
              onChange={handleChange}
            />
            {errors.otp && (
              <p className="text-red-500 text-xs italic">{errors.otp}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleResendOTP}
            className="w-full bg-gray-300 text-black py-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mb-4"
          >
            Resend OTP
          </button>

          {resendStatus && (
            <p className="text-center text-primary">{resendStatus}</p>
          )}

          <div className="mb-4 relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`appearance-none block w-full border rounded py-3 px-4 leading-tight text-black focus:outline-none ${
                errors.password ? "border-red" : ""
              }`}
              id="password"
              name="password"
              required
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password}</p>
            )}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 py-2 text-primary focus:outline-none"
            >
              {showPassword ? (
                <RiEyeOffFill size={24} />
              ) : (
                <RiEyeFill size={24} />
              )}
            </button>
          </div>

          <div className="mb-4 relative">
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`appearance-none block w-full border rounded py-3 px-4 leading-tight text-black focus:outline-none ${
                errors.confirmPassword ? "border-red" : ""
              }`}
              id="confirmPassword"
              name="confirmPassword"
              required
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs italic">
                {errors.confirmPassword}
              </p>
            )}
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 py-2 text-primary focus:outline-none"
            >
              {showConfirmPassword ? (
                <RiEyeOffFill size={24} />
              ) : (
                <RiEyeFill size={24} />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-800 text-black py-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
