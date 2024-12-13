import React, { useEffect, useState } from "react";
import useEvents from "../hooks/useEvents";
import { FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import maps from "../assets/maps.json";

import redIcon from "../assets/red-marker.png";
import yellowIcon from "../assets/yellow-marker.png";
import { formatDate } from "../utils/Data";

const MapButton = () => {
  const [events, setEvents] = useState([]);
  const [fetchedEvents] = useEvents();
  const [showMap, setShowMap] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    if (fetchedEvents) {
      const filteredEvents = fetchedEvents.filter((event)=>event.status !== "Inactive");
      setEvents(filteredEvents);
    }
  }, [fetchedEvents]);

  useEffect(() => {
    if (showMap) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showMap]);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const markerPromises = events.map(async (event) => {
          const location = event.coordinates;
          return {
            position: { lat: location.lat, lng: location.lng },
            title: event.Title,
            eventDetails: event,
          };
        });

        const updatedMarkers = await Promise.all(markerPromises);
        setMarkers(updatedMarkers);

        // Set the first marker as selected initially
        if (updatedMarkers.length > 0) {
          setSelectedMarker(updatedMarkers[0]);
        }
      } catch (error) {
        console.error("Error fetching geocode:", error);
      }
    };

    if (showMap && events.length > 0) {
      fetchMarkers();
    }
  }, [events, showMap]);

  const handleSlideChange = (swiper) => {
    const activeIndex = swiper.activeIndex;
    const activeEvent = events[activeIndex];
    setActiveEventIndex(activeIndex);

    if (mapInstance && activeEvent) {
      const { lat, lng } = activeEvent.coordinates;
      mapInstance.setCenter({ lat, lng });
      mapInstance.setZoom(10);

      const activeMarker = markers.find(
        (marker) => marker.eventDetails === activeEvent
      );
      setSelectedMarker(activeMarker);
    }
  };

  const mapStyles = {
    height: "50vh", // Adjusted height to accommodate slider
    width: "100%",
  };

  return (
    <div >
      <button
        className="fixed bottom-4 right-4 bg-black dark:bg-primary dark:text-black text-white p-4 rounded-full shadow-lg z-50"
        onClick={() => setShowMap(!showMap)}
      >
        <FaMapMarkerAlt size={24} />
      </button>
      {showMap && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-dullBlack text-black  w-full md:w-1/2  p-6 rounded-lg shadow-lg relative">
            <button
              className="text-red-500"
              onClick={() => setShowMap(false)}
            >
              <FaTimes size={24} />
            </button>

            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={8}
              center={
                markers[activeEventIndex]?.position || {
                  lat: 20.5937,
                  lng: 78.9629,
                }
              } // Default center (India)
              options={{
                styles: maps,
              }}
              onLoad={(map) => setMapInstance(map)}
            >
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={marker.position}
                  title={marker.title}
                  icon={{
                    url: selectedMarker === marker ? yellowIcon : redIcon,
                  }}
                />
              ))}
            </GoogleMap>

            <Swiper
              onSlideChange={handleSlideChange}
              spaceBetween={10}
              slidesPerView={1}
              centeredSlides={true}
              navigation={true}
              pagination={{ clickable: true, dynamicBullets: true }}
              className="mt-4"
              modules={[Pagination, Navigation]}
            >
              {events.map((event, index) => (
                <SwiperSlide key={index}>
                  <div className="flex gap-4 p-2 text-black bg-gray-100 dark:bg-secondary dark:text-white rounded-lg shadow-md">
                    <img
                      className="w-20 h-auto aspect-square object-cover rounded-md"
                      src={event.Image[0]}
                      alt="..."
                    />

                    <div>
                      <h3 className="text-md font-bold">{event.Title}</h3>
                      <p className="text-sm">Date: {formatDate(event.Date)}</p>
                      <p className="text-sm">Location: {event.Location}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapButton;