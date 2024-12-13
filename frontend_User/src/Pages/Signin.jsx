import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri"; // Import icons from React Icons
import axios from "axios";
import Cookies from "js-cookie";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    dispatch(signInFailure(null));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const response = await axios.post(`/api/auth/signin`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      const previousLocation = Cookies.get("redirectPath") || "/";
      navigate(previousLocation);
      Cookies.remove("redirectPath");
    } catch (error) {
      // Handle errors properly
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <>
      <div className="flex items-start justify-center h-[90vh] bg-white dark:bg-darkPrimary dark:text-white ">
      <div className="hidden lg:block lg:w-1/2 lg:h-full bg-cover">
          <img
            className="w-full object-cover h-full"
            src="https://assets.lummi.ai/assets/Qmatw3tYsBYwk1bXDKhv8oFZkomdN3vyTx21HXQUxFtQAu?auto=format&w=1500"
            alt=""
          />
        </div>
        <div
          className={`lg:w-1/2 h-full flex flex-col justify-center rounded-md p-8 w-full`}
        >
          <h1 className="text-3xl font-semibold text-center mb-6 text-black dark:text-primary">
            Hey✋🏻 Welcome Back!
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <OAuth />
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 border-black/20 dark:border-primary lg:w-1/4"></span>
              <Link
                to="/sign-in"
                className="text-xs text-center text-gray-500 uppercase"
              >
                or login with email
              </Link>
              <span className="border-b w-1/5 border-black/20 dark:border-primary lg:w-1/4"></span>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded-lg py-3 px-4 text-black dark:text-white bg-transparent focus:outline-none dark:focus:border-primary focus:border-black"
                id="email"
                required
                onChange={handleChange}
              />
            </div>
            <div className=" relative">
              <label htmlFor="password" className="sr-only text-black">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full text-black dark:text-white border bg-transparent rounded-lg py-3 px-4 focus:outline-none dark:focus:border-primary focus:border-black pr-12"
                id="password"
                required
                onChange={handleChange}
              />
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
            <Link
              className="text-xs text-right text-black dark:text-white block underline underline-offset-4"
              to="/forgot-password"
            >
              Forgot Password
            </Link>
            <button
              disabled={loading}
              className="w-full bg-black dark:bg-primary text-white dark:text-black py-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>

          {/* <p className="mt-2 text-xs text-gray-600 text-center">
                            I agree to abide by FindYourVibe
                            <a href="#" className="border-b border-gray-500 border-dotted">
                                {" "}Terms of Service{" "}
                            </a>
                            and its
                            <a href="#" className="border-b border-gray-500 border-dotted">
                            {" "}Privacy Policy{" "}
                            </a>
                        </p> */}
          {/* <div className="flex items-center text-gray-600 justify-center mt-2">
          <p className="mr-1 text-xs">Don't have an account?</p>
          <Link
            to={"/sign-up"}
            className="dark:text-primary text-black text-xs font-semibold border-b border-black"
          >
            Sign up
          </Link>
        </div> */}
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b border-black/20 dark:border-primary w-1/5 lg:w-1/4"></span>
            <Link
              to={"/sign-up"}
              className="py-2 px-4 text-xs text-center bg-black dark:bg-primary text-white dark:text-black rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              or signup with email
            </Link>
            <span className="border-b border-black/20 dark:border-primary w-1/5 lg:w-1/4"></span>
          </div>
          {error && (
            <p className="text-red-500 mt-5 text-xs text-center">{error}</p>
          )}
        </div>
      </div>
    </>
  );
}
