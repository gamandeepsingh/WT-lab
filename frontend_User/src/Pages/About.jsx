import React from "react";
import { ScrollRestoration } from "react-router-dom";

const About = () => {
  return (
    <div className="md:page-content bg-white text-black dark:text-white dark:bg-black">
      <ScrollRestoration />
      {/* <div className="min-h-screen flex items-center justify-center bg-white  text-black ">
      <div className="max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center  mb-4">About Our Event Listing</h1>
        <p className="text-lg  leading-relaxed">
          Welcome to our event listing web app! We're passionate about bringing you the best events in town. Whether you're looking for concerts, festivals, conferences, or workshops, we've got you covered.
        </p>
        <p className="text-lg text-primary  leading-relaxed mt-4">
          Our mission is to make it easy for you to discover and attend events
          that match your interests. With our intuitive search and filtering
          options, you can quickly find the perfect event for you.
        </p>
        <p className="text-lg text-primary  leading-relaxed mt-4">
          We're constantly updating our database to ensure you have access to
          the latest events happening in your area. Have a suggestion or
          feedback? We'd love to hear from you!
        </p>
      </div>
    </div> */}
      <div className="relative">
        <img
          className="w-full cursor-pointer h-[60vh] md:h-[70vh] object-cover brightness-50"
          src="https://res.cloudinary.com/dpcz9zmob/image/upload/v1725285909/Market_Crowd_Photo_orqn8d.jpg"
          alt="..."
        />
        <div className="absolute text-2xl md:text-4xl font-bold text-center font-poppins text-white -translate-x-1/2 left-1/2 top-1/2 w-[90vw] md:w-[80vw] -translate-y-1/2">
          Uniting the World Through Live Experiences
        </div>
      </div>
      <div className="bg-black text-white h-full flex items-center justify-center">
        <h2 className="text-center px-4 text-xl md:text-3xl font-semibold"></h2>
        <div className="py-6 pr-3 md:p-10 lg:p-16">
          <h1 className="text-lg md:text-xl font-bold mb-4">
            Hey, Party people!
          </h1>
          <p className="text-[#aaa] text-md md:text-lg lg:text-lg mb-8">
            Welcome to <span className="font-bold ">Find Your Vibe</span> -
            where your social life gets a major upgrade! Tired of hearing about
            awesome events after they’ve happened? With us, you’ll never feel
            FOMO (fear of missing out) again. We're here to keep you in the loop
            with all the buzz-worthy happenings in the city.
          </p>
          <h2 className="text-lg md:text-xl font-semibold mb-6">
            What do we do? It’s simple:
          </h2>
          <ul className="list-disc list-inside space-y-4 text-[#aaa] text-md md:text-lg lg:text-lg mb-8">
            <li className="list-disc">
              <span className="font-bold ">Regular Updates:</span> We dish out
              the latest events faster than you can say “What’s happening this
              weekend?”
            </li>
            <li className="list-disc">
              <span className="font-bold ">Ticket Solutions:</span> No more
              ticket troubles. We’ve got the hookup so you’re always ready to
              roll.
            </li>
            <li className="list-disc">
              <span className="font-bold ">Event Research:</span> We’re your
              personal event detectives, hunting down the coolest and most
              unique events just for you.
            </li>
          </ul>
          <p className="text-[#aaa] text-md md:text-lg lg:text-lg mb-8">
            At <span className="font-bold ">Find Your Vibe</span>, we’re all
            about making your city life vibrant and exciting. We believe that
            every night out should be memorable, and every event should be an
            adventure. Our quirky, fun-loving team is dedicated to ensuring you
            never miss a beat.
          </p>
          <p className="text-[#aaa] text-md md:text-lg lg:text-lg mb-8">
            So, whether you’re looking to discover hidden gems or hit up the
            hottest spots, we’ve got your back. Get ready to explore, enjoy, and
            elevate your social game with{" "}
            <span className="font-bold ">Find Your Vibe</span>. Life’s too short
            to stay in - let’s make some memories!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
