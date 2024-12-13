import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useDispatch } from "react-redux";
import axios from "axios";
import { validateInput } from "../constants";
import Cookies from "js-cookie";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
        [id]: "", // Reset error message when input becomes valid
      });
      setFormData({
        ...formData,
        [id]: value,
      });
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
      setLoading(true);
      const signUpResponse = await axios.post(`/api/auth/signup`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const signUpData = signUpResponse.data;

      if (signUpData.success === false) {
        setLoading(false);
        setError(signUpData.message);
        return;
      }

      setLoading(false);
      setError(null);
      const signInData = {
        email: formData.email,
        password: formData.password,
      };

      try {
        setLoading(true);
        const signInResponse = await axios.post(
          `/api/auth/signin`,
          signInData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const signInDataResponse = signInResponse.data;

        if (signInDataResponse.success === false) {
          dispatch(signInFailure(signInDataResponse.message));
          return;
        }

        dispatch(signInSuccess(signInDataResponse));
        const previousLocation = Cookies.get("redirectPath") || "/";
        navigate(previousLocation);
        Cookies.remove("redirectPath");
      } catch (signInError) {
        setLoading(false);
        dispatch(signInFailure(signInError.message));
        navigate("/sign-in");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="flex items-start justify-center lg:h-[110vh] bg-white dark:bg-darkPrimary dark:text-white ">
      <div className="hidden lg:block lg:w-1/2 lg:h-full bg-cover">
        <img
          className="w-full object-cover h-full"
          src="https://assets.lummi.ai/assets/QmRQ8boeaHND8hn9Uu8DcfB37Lfrz4hWAADPPwCmRVXaSS?auto=format&w=1500"
          alt=""
        />
      </div>
      <div
        className={`lg:w-1/2 h-full flex flex-col justify-center rounded-md p-8 w-full `}
      >
        <h1 className="text-3xl font-semibold text-center mb-6 text-black dark:text-primary">
          Let's Take You In!
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <OAuth />
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 border-black/20 dark:border-primary lg:w-1/4"></span>
            <Link
              to={"/sign-in"}
              className="text-xs text-center text-gray-500 uppercase"
            >
              or signup with email
            </Link>
            <span className="border-b w-1/5 border-black/20 dark:border-primary lg:w-1/4"></span>
          </div>
          <input
            type="text"
            placeholder="*Name"
            className={`w-full border rounded-lg py-3 px-4 text-black dark:text-white bg-transparent focus:outline-none dark:focus:border-primary focus:border-black placeholder:text-sm ${
              errors.name ? "border-red-500" : ""
            }`}
            id="name"
            required
            onChange={handleChange}
          />

          {errors.name && (
            <p className="text-red-500 text-xs italic">{errors.name}</p>
          )}

          <input
            type="text"
            placeholder="*Username"
            className={`w-full border rounded-lg py-3 px-4 text-black dark:text-white bg-transparent focus:outline-none dark:focus:border-primary focus:border-black placeholder:text-sm ${
              errors.username ? "border-red-500" : ""
            }`}
            id="username"
            required
            onChange={handleChange}
          />

          {errors.username && (
            <p className="text-red-500 text-xs italic">{errors.username}</p>
          )}
          <input
            type="email"
            placeholder="*Email"
            className="w-full border rounded-lg py-3 px-4 text-black dark:text-white bg-transparent focus:outline-none dark:focus:border-primary focus:border-black placeholder:text-sm"
            id="email"
            required
            onChange={handleChange}
          />

          <input
            type="number"
            placeholder="*Mobile Number"
            className={`w-full border rounded-lg py-3 px-4 text-black dark:text-white bg-transparent focus:outline-none dark:focus:border-primary focus:border-black placeholder:text-sm ${
              errors.phoneNo ? "border-red" : ""
            }`}
            id="phoneNo"
            onChange={handleChange}
          />
          {errors.phoneNo && (
            <p className="text-red-500 text-xs italic">{errors.phoneNo}</p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="*Password"
              className={`w-full border rounded-lg py-3 px-4 text-black dark:text-white bg-transparent focus:outline-none dark:focus:border-primary focus:border-black placeholder:text-sm  ${
                errors.password ? "border-red" : ""
              }`}
              id="password"
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password}</p>
            )}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 py-2 text-black dark:text-primary focus:outline-none"
            >
              {showPassword ? (
                <RiEyeOffFill size={24} />
              ) : (
                <RiEyeFill size={24} />
              )}{" "}
              {/* Use React Icons */}
            </button>
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-lg font-medium text-gray-800 mb-1"
            ></label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              onChange={handleChange}
              placeholder="*Confirm password"
              required
              className={`w-full border rounded-lg py-3 px-4 text-black dark:text-white bg-transparent focus:outline-none dark:focus:border-primary focus:border-black placeholder:text-sm  ${
                errors.confirmPassword ? "border-red" : ""
              }`}
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-xs italic">
                {errors.confirmPassword}
              </p>
            )}

            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 py-2 text-black dark:text-primary focus:outline-none"
            >
              {showConfirmPassword ? (
                <RiEyeOffFill size={24} />
              ) : (
                <RiEyeFill size={24} />
              )}
            </button>
          </div>
          <button
            disabled={loading}
            className="w-full bg-black dark:bg-primary text-white dark:text-black py-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
        {/* <div className="flex  items-center justify-center gap-2 mt-5">
          <p>Have an account?</p>
          <Link
            className="text-primary font-semibold hover:underline"
            to={"/sign-in"}
          >
            <span className="text-primary">Sign in</span>
          </Link>
        </div> */}
        <div className="mt-4 flex items-center justify-between">
          <span className="border-b w-1/5 border-black/20 dark:border-primary lg:w-1/4"></span>
          <Link
            to={"/sign-in"}
            className="py-2 px-4 text-xs text-center bg-black dark:bg-primary text-white dark:text-black rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            or login with email
          </Link>
          <span className="border-b w-1/5 border-black/20 dark:border-primary lg:w-1/4"></span>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  );
}
