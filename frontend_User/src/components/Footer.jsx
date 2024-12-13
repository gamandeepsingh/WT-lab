import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "../assets/fyv-dark.gif";
import logo2 from "../assets/fyv-white.gif";
import logoNav from "../assets/fyv-nav.png";
import useTheme from "../contexts/theme";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

function Footer() {
  const { themeMode } = useTheme();
  const handleRedir = () => {
    Cookies.set("redirectPath", location.pathname, { expires: 1 });
  };
  return (
    <footer
      className={`xl:px-8 p-8 pb-0 bg-darkPrimary text-white shadow-2xl z-20 w-full `}
    >
      <hr className="border-white" />
      <div className="h-fit my-8 flex">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-16">
          <div className="flex justify-center lg:justify-start w-[60%]">
            <Link to="/">
              <img src={logo} width={500} alt="logo" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left w-full">
            <div>
              <h4 className="text-md font-medium">Resources</h4>
              <div className={"mt-4 lg:mb-0 text-xs flex flex-col space-y-1 "}>
                <Link
                  to="/about"
                  className="opacity-50 hover:text-primary hover:opacity-100 transition-all duration-300 ease-in-out"
                >
                  About Us
                </Link>
                <Link
                  className="opacity-50 hover:text-primary hover:opacity-100 transition-all duration-300 ease-in-out"
                  to="/terms-conditions"
                >
                  Terms & Conditions
                </Link>
                <Link
                  className="opacity-50 hover:text-primary hover:opacity-100 transition-all duration-300 ease-in-out"
                  to="/privacy-policy"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium ">Contact</h4>
              <div className={"mt-4 lg:mb-0 text-xs flex flex-col space-y-1 "}>
                <Link
                  className="opacity-50 hover:text-primary hover:opacity-100 transition-all duration-300 ease-in-out"
                  to={"/contact-us"}
                >
                  Help & Support
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium ">Social</h4>
              <div className={"mt-4 lg:mb-0 text-lg flex gap-2 items-center"}>
                <a
                  className="opacity-50 hover:text-primary hover:opacity-100 transition-all duration-300 ease-in-out"
                  href="https://www.instagram.com/findyourvibe.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>

                <a
                  className="opacity-50 hover:text-primary hover:opacity-100 transition-all duration-300 ease-in-out"
                  href="https://chat.whatsapp.com/G1okyOZyEajBFb1RNzNLVF"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <hr className="" />
      <div className="py-4 flex justify-between items-center">
        <p className="text-[10px] md:text-xs text-white/50">
          © 2024 FindYourVibe | All rights reserved.
        </p>
        <p className="text-[10px] md:text-xs text-white/50">
          Developed & Designed by{" "}
          <a className="underline" href="https://elanine.com">
            Elanine Creatives
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
