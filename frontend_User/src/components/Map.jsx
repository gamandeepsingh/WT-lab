import React, { useState } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import maps from "../assets/maps.json";

const Map = ({ coordinates,address }) => {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  const handleInfoWindowClose = () => {
    setInfoWindowOpen(false);
  };

  const handleMarkerClick = () => {
    setInfoWindowOpen(true);
  };

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const center = coordinates
    ? { lat: coordinates.lat, lng: coordinates.lng }
    : { lat: 0, lng: 0 }; // Default to (0,0) if coordinates not fetched

  return (
    <div className="w-full mt-6 p-4 flex justify-center items-center bg-white dark:bg-dullBlack rounded-lg shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={{
          styles: maps,
        }}
      >
        <Marker position={center} onClick={handleMarkerClick} />

        {infoWindowOpen && (
          <InfoWindow position={center} onCloseClick={handleInfoWindowClose}>
            <div>
              <p className="text-black">{address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
