import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation, Mousewheel, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import graphicThree from "../assets/Layer_3.svg";

const PromotionalEvents = ({ promotionalEvents }) => {
  return (
    <div className="hidden md:block space-y-4 md:space-y-8 relative lg:px-0">
      {/* <img
        src={graphicThree}
        className="absolute left-1/2 transform -translate-x-1/2 -top-10"
        alt=""
      /> */}
      {/* <h1 className="text-black font-semibold text-2xl p-2 z-10 lg:text-left">
        Trending Events
      </h1> */}

      {promotionalEvents.length > 0 && (
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          centeredSlides={true}
          breakpoints={{
            640: {
              slidesPerView: 1.2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1.2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 1.2,
              spaceBetween: 40,
            },
          }}
          loop={promotionalEvents.length > 1}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          // mousewheel={true}
          // keyboard={true}
          autoplay={{
            delay: 3000, // 3 seconds delay
            disableOnInteraction: false, // Continue autoplay after user interactions
          }}
          modules={[Pagination, Autoplay, Navigation]}
        >
          {promotionalEvents.map((event) => (
            <SwiperSlide key={event._id}>
              <Link to={`/event/${event._id}`}>
                <div
                  style={{
                    background: `url(${event.Image[1]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="z-10  w-full h-[400px] md:h-[500px] aspect-video rounded-3xl shadow-lg flex items-center justify-center text-black"
                >
                  <div className="p-4">
                    {/* You can add more content here if needed */}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default PromotionalEvents;
