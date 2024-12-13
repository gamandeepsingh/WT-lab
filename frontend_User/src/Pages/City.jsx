import React, { useMemo } from "react";
import useEvents from "../hooks/useEvents";
import { ScrollRestoration, useParams } from "react-router-dom";
import EventCard from "../components/EventCard";
import { PiSmileySadThin } from "react-icons/pi";
import Loader from "../components/Loader";

const City = () => {
  const [events, loading] = useEvents();
  // console.log(loading)
  const { city, state } = useParams();
  
  const allEvents = useMemo(() => {
    if (events) {
      let filteredEvents = events.filter(
        (event) => event.status !== "Inactive"
      );

      // Filter based on city and state
      if (state) {
        filteredEvents = filteredEvents.filter(
          (event) => event.State === state
        );
      }
      if (city) {
        filteredEvents = filteredEvents.filter(
          (event) => event.City === city
        );
      }
      filteredEvents.sort((a, b) => new Date(a.Date) - new Date(b.Date));
      return filteredEvents;
    }
    return [];
  }, [events, city, state]);

  // console.log(allEvents);

  return (
    <div className="min-h-screen bg-white dark:bg-black mx-auto p-4 relative text-black dark:text-white">
      <ScrollRestoration />

      {loading ? (
        <Loader />
      ) : (
        <div>
          {allEvents.length === 0 ? (
            <p className="text-center h-96 gap-4 flex flex-col justify-center items-center">
              <PiSmileySadThin size={100} /> Sorry, No events found in this location!
            </p>
          ) : (
            <div className="">
              {allEvents.map((event) => (
                  <div className="inline-block align-top w-full sm:w-1/2 lg:w-1/4 p-2" key={event._id}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default City;
