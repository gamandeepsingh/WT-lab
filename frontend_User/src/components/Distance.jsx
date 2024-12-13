import React, { useEffect, useState } from "react";

const options = {
  enableHighAccuracy: false,
  timeout: 60 * 1000,
  maximumAge: 5 * 60 * 1000,
};

const CACHE_KEY = "userCoordinates";
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const Distance = ({ location }) => {
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleCalculateDistance();
  }, []);

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const handleCalculateDistance = async () => {
    try {
      setLoading(true);
      const cachedPosition = getCachedPosition();
      let position;

      if (cachedPosition) {
        position = cachedPosition;
      } else {
        console.log("Set cache position");
        position = await getCurrentPosition();
        cachePosition(position);
      }

      if (!position) {
        setError("Unable to retrieve the current location.");
        console.log("Unable to retrieve the current location.");
        return;
      }

      const { latitude, longitude } = position.coords;
      const origin = new window.google.maps.LatLng(latitude, longitude);
      const destinationPlace = location;

      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destinationPlace],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === window.google.maps.DistanceMatrixStatus.OK) {
            const { distance, duration } = response.rows[0].elements[0];
            setDistance(distance.text);
            setDuration(duration.text);
            setError("");
          } else {
            handleDistanceMatrixError(status);
          }
          setLoading(false);
        },
      );
    } catch (error) {
      handleGeneralError(error);
      setLoading(false);
    }
  };

  const getCachedPosition = () => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;

    const { timestamp, coords } = JSON.parse(cachedData);
    if (Date.now() - timestamp > CACHE_EXPIRATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return { coords };
  };

  const cachePosition = (position) => {
    const data = {
      timestamp: Date.now(),
      coords: position.coords,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  };

  const handleDistanceMatrixError = (status) => {
    if (status === window.google.maps.DistanceMatrixStatus.REQUEST_DENIED) {
      setError(
        "Location access denied. Please enable location on your device.",
      );
    } else {
      setError("Error fetching distance. Please check your destination.");
    }
    setDistance("");
    setDuration("");
  };

  const handleGeneralError = (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      setError(
        "Location access denied. Please enable location on your device.",
      );
    } else {
      setError("Error fetching distance. Please try again later.");
      console.error("Error fetching distance:", error);
    }
    setDistance("");
    setDuration("");
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex items-center w-full text-sm justify-center bg-dullBlack dark:bg-secondary rounded-md shadow-sm p-3">
          <p className="text-white/50 dark:text-white">Loading...</p>
        </div>
      ) : (
        <>
          {distance && duration ? (
            <div className="flex items-center w-full text-sm justify-center bg-dullBlack dark:bg-secondary rounded-md shadow-sm p-3">
              <p className="text-white/50 dark:text-white">
                <span className="font-bold text-white dark:text-primary">
                  {distance}
                </span>{" "}
                Away {" | "}
                <span className="font-bold text-white dark:text-primary">
                  {duration}
                </span>{" "}
                to reach!!
              </p>
            </div>
          ) : (
            error && (
              <div className="flex items-center w-full text-sm justify-center bg-red-500 rounded-md shadow-sm p-3">
                <p className="text-white">{error}</p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Distance;
