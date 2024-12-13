import React, { useEffect } from "react";
import Confetti from "./Confetti";
import { typeOptions } from "../constants";
import { Link } from "react-router-dom"; 

const imageUrls = [
  "https://res.cloudinary.com/dpcz9zmob/image/upload/v1724224689/Free_Party_Room_fjgu6n.jpg", // Parties
  "https://res.cloudinary.com/dpcz9zmob/image/upload/v1724224690/Stage_Crowd_Man_r21j8q.jpg", // Standup
  "https://res.cloudinary.com/dpcz9zmob/image/upload/v1724224690/Woman_with_bowl_y0iazp.jpg", // Workshop
  "https://res.cloudinary.com/dpcz9zmob/image/upload/v1724224689/Meetup_Pictures_Redd_mi4i2y.jpg", // Meetup
  "https://res.cloudinary.com/dpcz9zmob/image/upload/v1724224693/Concert_People_Daytime_zbhtm1.jpg", //concerts
  "https://res.cloudinary.com/dpcz9zmob/image/upload/v1724224690/People_in_front_of_painting_cmiaxr.jpg", //exhibition
  "https://res.cloudinary.com/dpcz9zmob/image/upload/v1724224826/Conference_People_on_Chair_ueh31j.jpg", //live vibes
];

const CategoryExplore = () => {
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
      <h2 className="text-2xl mb-8 font-semibold">
        <Confetti>Explore By Category</Confetti>
      </h2>
      <div className="flex overflow-x-auto no-scrollbar space-x-4">
        {typeOptions.map((type, index) => (
          <Link key={type} to={`/category/${type}`} className="aspect-square w-32 md:w-52 md:h-52 relative flex-shrink-0">
            <img
              className="w-full cursor-pointer rounded-2xl brightness-50 h-full object-cover"
              src={imageUrls[index]}
              alt={type}
            />
            <h2 className="absolute text-sm text-white -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2">
              {type}
            </h2>
          </Link>
        ))}
        {/* Card for Explore All */}
        <Link to="/explore" className="aspect-square w-32 md:w-52 md:h-52 relative bg-secondary hover:bg-primary hover:text-secondary transition-all duration-300 ease-in-out cursor-pointer rounded-md flex-shrink-0">
          <h2 className="absolute text-white text-sm -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2">
            Explore All
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default CategoryExplore;
