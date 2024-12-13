import React, { useRef } from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";

const Places = ({ onLocationChange, defaultValue = "" }) => {
  const inputRef = useRef();

  const handlePlacesChanged = () => {
    const [place] = inputRef.current.getPlaces();

    if (place) {
      const formattedAddress = place.formatted_address;
      const placeName = place.name;

      // Extract state and city from the address
      let state = "";
      let city = "";
      const addressComponents = place.address_components || [];
      addressComponents.forEach((component) => {
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
      });

      // console.log(city,state)

      // Check if the placeName is included in the formattedAddress
      let completeAddress;
      if (
        placeName &&
        formattedAddress &&
        formattedAddress.startsWith(placeName)
      ) {
        // Remove placeName from formattedAddress if it's duplicated
        completeAddress = formattedAddress;
      } else {
        // Concatenate placeName and formattedAddress
        completeAddress = placeName
          ? `${placeName}, ${formattedAddress}`
          : formattedAddress;
      }

      onLocationChange(completeAddress,state,city);
    }
  };

  return (
    <StandaloneSearchBox
      onLoad={(ref) => (inputRef.current = ref)}
      onPlacesChanged={handlePlacesChanged}
    >
      <input
        type="text"
        placeholder="Enter Address"
        defaultValue={defaultValue}
        className="mt-1 p-2 w-full border border-gray-400 placeholder:text-white placeholder:text-xs text-inherit rounded-md text-xs md:text-sm bg-transparent"
        required
      />
    </StandaloneSearchBox>
  );
};

export default Places;
