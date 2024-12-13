import { monthNames } from "../constants";

const config = {
  cUrl: "https://api.countrystatecity.in/v1/countries",
  ckey: import.meta.env.VITE_CKEY,
};

export const loadStates = async () => {
  try {
    const response = await fetch(`${config.cUrl}/in/states`, {
      headers: {
        "X-CSCAPI-KEY": config.ckey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load states");
    }

    const data = await response.json();
    return data.map((state) => [state.iso2, state.name]);
  } catch (error) {
    console.error("Error loading states:", error);
    return [];
  }
};

export const loadCities = async (stateCode) => {
  try {
    const response = await fetch(
      `${config.cUrl}/in/states/${stateCode}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY": config.ckey,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to load cities");
    }

    const data = await response.json();
    return data.map((city) => [city.iso2, city.name]);
  } catch (error) {
    console.error("Error loading cities:", error);
    return [];
  }
};

const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const startToEndDateFormat = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const getDayWithSuffix = (date) => {
    const day = date.getDate();
    const suffix = (() => {
      switch (day) {
        case 1:
        case 21:
        case 31:
          return "st";
        case 2:
        case 22:
          return "nd";
        case 3:
        case 23:
          return "rd";
        default:
          return "th";
      }
    })();
    return `${day}${suffix}`;
  };
  const startMonth = shortMonthNames[start.getMonth()];
  const endMonth = shortMonthNames[end.getMonth()];
  const year = end.getFullYear();
  if (startMonth === endMonth) {
    return `${startMonth} ${getDayWithSuffix(start)} - ${getDayWithSuffix(end)}, ${year}`;
  } else {
    return `${startMonth} ${getDayWithSuffix(start)} - ${endMonth} ${getDayWithSuffix(end)}, ${year}`;
  }
};

export const formatDate = (dateString) => {
  const eventDate = new Date(dateString);
  const day = eventDate.getDate();
  const suffix = (() => {
    switch (day) {
      case 1:
      case 21:
      case 31:
        return "st";
      case 2:
      case 22:
        return "nd";
      case 3:
      case 23:
        return "rd";
      default:
        return "th";
    }
  })();
  const month = monthNames[eventDate.getMonth()];
  const year = eventDate.getFullYear();

  return `${month} ${day}${suffix}, ${year}`;
};

export const geocodeAddress = async (address) => {
  if (!window.google || !window.google.maps) {
    throw new Error("Google Maps JavaScript API not loaded.");
  }

  const geocoder = new window.google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        const latitude = location.lat();
        const longitude = location.lng();
        resolve({ latitude, longitude });
      } else {
        reject(
          "Geocode was not successful for the following reason: " + status,
        );
      }
    });
  });
};

export const reverseGeocode = async (latitude, longitude) => {
  if (!window.google || !window.google.maps) {
    throw new Error("Google Maps JavaScript API not loaded.");
  }

  const geocoder = new window.google.maps.Geocoder();
  const latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };

  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          const addressComponents = results[0].address_components;
          let city = "";
          let state = "";

          for (const component of addressComponents) {
            const types = component.types;
            if (types.includes("locality")) {
              city = component.long_name;
            } else if (types.includes("administrative_area_level_1")) {
              state = component.long_name;
            }
          }

          const formattedAddress = results[0].formatted_address;
          resolve({ formattedAddress, city, state });
        } else {
          reject("No results found");
        }
      } else {
        reject(
          "Geocode was not successful for the following reason: " + status,
        );
      }
    });
  });
};
