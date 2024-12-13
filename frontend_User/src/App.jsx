import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutUserSuccess,
  updateUserSuccess,
  updateCity,
  updateState,
} from "./redux/user/userSlice";
import axios from "axios";
import { ThemeProvider } from "./contexts/theme";
import Footer from "./components/Footer";
import toast, { Toaster } from "react-hot-toast";
import MarqueeSection from "./components/MarqueeSection";
import useEvents from "./hooks/useEvents";
import { LoadScript } from "@react-google-maps/api";
import { reverseGeocode } from "./utils/Data";
import MapButton from "./components/MapButton";
import ReactGA from "react-ga4";
import { HelmetProvider } from 'react-helmet-async';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-API-Key"] =
  import.meta.env.VITE_BACKEND_API_KEY;

const libraries = ["places"];

const App = () => {
  const GA4ID = "G-RTCCH7C0LX";
  ReactGA.initialize(GA4ID);

  const dispatch = useDispatch();
  const city = useSelector((state) => state.user.city);
  const state = useSelector((state) => state.user.state);
  const [events] = useEvents();
  const location = useLocation();
  const shouldRenderMapButton = !/^\/event\/\d+/.test(location.pathname);

  useEffect(() => {
    if (city && state) {
      if (events) {
        const availableEvents = events
          ? events.filter((event) => event.City == city && event.State == state)
          : [];

        if (availableEvents.length === 0)
          toast.error("No events found in your city, showing all events");
      }
    }
  }, [events]);

  useEffect(() => {
    if (!city || !state) {
      // Request user's location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const { city, state } = await reverseGeocode(latitude, longitude);

          if (city && state) {
            dispatch(updateCity(city));
            dispatch(updateState(state));
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            console.error("User denied the geolocation permission");
            toast.error("Please enable location access to use this feature.");
          } else {
            console.error("Error fetching the location", error);
            toast.error("Error fetching the location");
          }
        },
      );
    }
  }, [city]);

  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("themeMode") || "dark",
  );

  const darkTheme = useCallback(() => {
    setThemeMode("dark");
  }, []);

  const lightTheme = useCallback(() => {
    setThemeMode("light");
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      document.documentElement.className = themeMode;
      localStorage.setItem("themeMode", themeMode);
    };

    updateTheme();
  }, [themeMode]);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const res = await axios.get(`/api/auth/check-token`);
        const data = res.data;
        if (data.success === false) {
          dispatch(signOutUserSuccess({}));
        }

        dispatch(updateUserSuccess(data.user));
      } catch (error) {
        console.error("Error checking token validity:", error);
      }
    };

    checkTokenValidity();
  }, []);

  return (
    <HelmetProvider>
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GEOCODE_KEY}
      libraries={libraries}
    >
      <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
        <MarqueeSection />
        <Navbar />
        {shouldRenderMapButton && <MapButton />}

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 2000,
            style: {
              background: "#b5d300",
              color: "#000",
              borderRadius: "20px",
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
            },
          }}
        />
        <Outlet />
        <Footer />
      </ThemeProvider>
    </LoadScript>
    </HelmetProvider>
  );
};

export default App;
