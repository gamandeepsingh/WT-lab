import React, { useEffect } from "react";
import Confetti from "./Confetti";
import { Link } from "react-router-dom";
const CityExplore = () => {
  useEffect(() => {
    const confetti = () => {
      document.querySelectorAll(".particletext.confetti").forEach((element) => {
        const confettiCount = (element.offsetWidth / 50) * 2;
        for (let i = 0; i <= confettiCount; i++) {
          const particle = document.createElement("span");
          particle.className = `particle c${rnd(1, 2)}`;
          particle.style.top = `${rnd(10, 50)}%`;
          particle.style.left = `${rnd(0, 100)}%`;
          particle.style.width = `${rnd(6, 8)}px`;
          particle.style.height = `${rnd(3, 4)}px`;
          particle.style.animationDelay = `${rnd(0, 30) / 10}s`;
          element.appendChild(particle);
        }
      });
    };

    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    confetti();
  }, []);
  return (
    <div className="relative px-4 mt-4 md:p-12 md:pb-4">
      <h2 className="text-lg mb-8 font-semibold">
        <Confetti>Explore By Cities</Confetti>
      </h2>
      <section className="">
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-full">
            <div className="col-span-2 sm:col-span-1 md:col-span-2 h-auto md:h-full flex flex-col">
              <Link
                to={"/cities/Chhattisgarh/Raipur"}
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
              >
                <img
                  src="https://res.cloudinary.com/dpcz9zmob/image/upload/v1724223864/City_view_Raipur_dyif0i.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <h3 className="z-10 text-lg font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-lg">
                  Raipur, Chhatisgarh
                </h3>
              </Link>
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-2">
              <Link
                to={"/cities/Maharashtra/Mumbai"}
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 mb-4"
              >
                <img
                  src="https://res.cloudinary.com/dpcz9zmob/image/upload/v1724223864/Mumbai_Red_Roof_Building_qi5wg4.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="city-coming-strip">COMING SOON</div>
                <h3 className="z-10 text-lg font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-lg">
                  Mumbai
                </h3>
              </Link>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2">
                <Link
                  to={"/cities/Karnataka/Bengaluru"}
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                >
                  <img
                    src="https://res.cloudinary.com/dpcz9zmob/image/upload/v1724224047/City_skyline_Bangalore_apcmuu.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                  <div className="city-coming-strip">COMING SOON</div>
                  <h3 className="z-10 text-lg font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-lg">
                    Bengaluru
                  </h3>
                </Link>
                <Link
                  to={"/cities/Maharashtra/Pune"}
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                >
                  <img
                    src="https://res.cloudinary.com/dpcz9zmob/image/upload/v1724223871/Tall_Building_Windows_oeippg.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                  <div className="city-coming-strip">COMING SOON</div>
                  <h3 className="z-10 text-lg font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-lg">
                    Pune, Maharashtra
                  </h3>
                </Link>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-1 h-auto md:h-full flex flex-col">
              <Link
                to={"/cities/West Bengal/Kolkata"}
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
              >
                <img
                  src="https://res.cloudinary.com/dpcz9zmob/image/upload/v1724223866/White_concrete_castle_near_water_t17h3v.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="city-coming-strip">COMING SOON</div>
                <h3 className="z-10 text-lg font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-lg">
                  Kolkata
                </h3>
              </Link>
            </div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 grid-col-span-custom">
              <Link
                to={"/cities/Himachal Pradesh"}
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
              >
                <img
                  src="https://res.cloudinary.com/dpcz9zmob/image/upload/v1724612367/Mountain_Range_Sunset_zklfuu.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="city-coming-strip">COMING SOON</div>
                <h3 className="z-10 text-lg font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-lg">
                  Himachal Pradesh
                </h3>
              </Link>
              <Link
                to={"/cities/Delhi/Delhi"}
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
              >
                <img
                  src="https://res.cloudinary.com/dpcz9zmob/image/upload/v1724223864/Clock_Tower_Delhi_bhr7jx.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <div className="city-coming-strip">COMING SOON</div>
                <h3 className="z-10 text-lg font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-lg">
                  Delhi
                </h3>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CityExplore;
