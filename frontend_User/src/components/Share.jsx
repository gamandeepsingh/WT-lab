import React from "react";
import {
  WhatsappIcon,
  WhatsappShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookShareButton,
  // InstagramShareButton,
  LinkedinShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  // InstagramIcon,
  XIcon,
} from "react-share";
import { FaInstagram } from "react-icons/fa";
import { FaMeta, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";

const Share = ({ description }) => {
  const shareUrl = window.location.href;

  return (
    <>
      <div className="flex flex-col md:w-1/2 md:flex-row items-left md:items-center">
        <div className="bg-dullBlack md:flex-col flex-row   p-4 flex w-full justify-between gap-3 items-center text-base text-white/50 rounded-md dark:border-primary dark:border">
          <p className="text-xs md:text-base">Share this Event: </p>
          <div className="flex gap-2 text-white p-1">
            {/* Facebook */}
            <FacebookShareButton url={shareUrl} quote={description}>
              <FaMeta size={30} />
            </FacebookShareButton>

            {/* Instagram */}
            <a href="https://www.instagram.com/findyourvibe.in" target="_blank">
              <FaInstagram size={30} className="" />
            </a>

            {/* Twitter */}
            {/* <TwitterShareButton url={shareUrl} title={description}>
          <XIcon size={30}  />
        </TwitterShareButton> */}

            {/* LinkedIn */}
            <LinkedinShareButton
              url={shareUrl}
              source={"Find your vibe"}
              title={description}
            >
              <FaLinkedinIn size={30} />
            </LinkedinShareButton>

            {/* Email */}
            {/* <EmailShareButton url={shareUrl} subject={"Sharing Event i found on Find you Vibe"} body={description} separator="," >
          <EmailIcon size={30}  />
        </EmailShareButton> */}

            {/* Whatsapp */}

            <WhatsappShareButton
              url={shareUrl}
              title={description}
              separator=","
            >
              <FaWhatsapp size={30} />
            </WhatsappShareButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Share;
