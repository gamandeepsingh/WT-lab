import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { RiMenu5Fill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import logoNav from "../assets/fyv-nav.png";
import logo from "../assets/fyv-dark.gif";
import logo2 from "../assets/fyv-white.gif";
import axios from "axios";
import graphicOne from "../assets/Layer_1.svg";
import ThemeBtn from "../components/ThemeBtn";
import { BiSolidOffer } from "react-icons/bi";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import useTheme from "../contexts/theme";
import Loader from "./Loader";
import { LuHome } from "react-icons/lu";
import {
  MdLocalOffer,
  MdOutlineExplore,
  MdOutlineInterests,
  MdOutlineEvent,
  MdOutlineCreateNewFolder,
} from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoQrCode } from "react-icons/io5";
const Navbar = () => {
  const { themeMode } = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    // Cleanup function to reset overflow when the component unmounts
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { path: "/", text: "Home", icon: <LuHome /> },
    { path: "/explore", text: "Explore", icon: <MdOutlineExplore /> },
    { path: "/offers", text: "Offers", icon: <BiSolidOffer /> },
    { path: "/about", text: "About Us", icon: <FaUsers /> },
    { path: "/wishlist", text: "Interested", icon: <MdOutlineInterests /> },
  ];

  const profileItems = [];

  if (currentUser) {
    profileItems.push({ path: "/profile", text: "View Profile" });
    navItems.push({
      path: "/my-bookings",
      text: "My Bookings",
      icon: <IoQrCode />,
    });

    if (
      currentUser.userRole === "organizer" ||
      currentUser.userRole === "Admin"
    ) {
      navItems.push({
        path: "/post-offer",
        text: "Post Offers",
        icon: <MdLocalOffer />,
      });
      navItems.push({
        path: "/post-event",
        text: "Organise Event",
        icon: <MdOutlineCreateNewFolder />,
      });
      navItems.push({
        path: "/dashboard",
        text: "My Dashboard",
        icon: <MdOutlineEvent />,
      });
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true);
      dispatch(signOutUserStart());
      const response = await axios.get(`/api/auth/signout`, {});
      const data = response.data;
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const handleRedir = () => {
    Cookies.set("redirectPath", location.pathname, { expires: 1 });
  };
  return (
    <nav className="p-2 dark:bg-darkPrimary bg-lightPrimary w-full z-30 dark:text-white ">
      <div className="md:px-6 flex justify-between items-center gap-4">
        {/* Hamburger menu for mobile */}
        <button
          className={`md:hidden text-2xl z-50 cursor-pointer hover:text-gray-400 transition-transform duration-300 ${
            mobileMenuOpen ? "transform rotate-180" : ""
          }`}
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <CgClose /> : <RiMenu5Fill />}
        </button>

        {/* Man with Guitar */}
        {/* <img
          src={graphicOne}
          className="top-10 hidden md:block right-0 pointer-events-none absolute z-30"
          alt="..."
        /> */}

        <div className="w-full bg-white dark:bg-darkPrimary flex justify-between items-center -mt-1 rounded-br-2xl p-0">
          {/* Logo */}
          <div className="w-fit flex justify-center md:justify-start z-10">
            <Link to="/">
              <img
                src={themeMode === "dark" ? logo : logo2}
                width={80}
                alt="logo"
              />
            </Link>
          </div>

          {/* Navigation items for desktop */}
          <div className="hidden md:flex justify-end space-x-4 bg-gray-300 dark:bg-secondary rounded-full py-1 pr-4 pl-1">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "bg-black whitespace-nowrap text-white dark:bg-primary dark:text-secondary px-6 py-2 text-xs rounded-full"
                    : "whitespace-nowrap dark:border-0 text-black dark:text-primary px-1 py-2 text-xs rounded-md"
                }
              >
                {item.text}
              </NavLink>
            ))}
          </div>

          <div className="w-fit relative flex gap-2 bg-white dark:bg-darkPrimary -mt-1 rounded-bl-lg px-0 py-3">
            <ThemeBtn />
            {currentUser ? (
              <div className="flex gap-2">
                <Link to={"/profile"}>
                  <img
                    className="h-9 w-9 rounded-full object-cover"
                    src={currentUser.avatar}
                    alt="Profile"
                  />
                </Link>

                <button
                  onClick={handleSignOut}
                  className="bg-black text-white dark:bg-primary text-xs hover:opacity-90 dark:text-black py-2 px-6 rounded-full"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                onClick={handleRedir}
                className="bg-black text-white dark:bg-primary text-xs hover:opacity-90 dark:text-black py-2 px-6 rounded-full"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden h-[80vh] dark:bg-secondary dark:text-white bg-black text-white my-6 py-4 px-4 w-full flex justify-between text-md items-left flex-col">
          <div>
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  isActive
                    ? "active py-2 flex items-center gap-2"
                    : "py-2 flex items-center gap-2"
                }
              >
                {item.icon}
                {item.text}
              </NavLink>
            ))}
          </div>
          <div>
            <Link to="/">
              <img src={logoNav} width={120} alt="logo" />
            </Link>
            <p className="text-xs mt-2">
              @2024 Find Your Vibe | All Rights Reserved
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
