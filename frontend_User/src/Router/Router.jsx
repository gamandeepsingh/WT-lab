import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import Signin from "../Pages/Signin";
import Signup from "../Pages/Signup";
import Profile from "../Pages/Profile";
import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";
import About from "../Pages/About";
import ContactSupport from "../Pages/ContactSupport";
import PostEvent from "../Pages/PostEvent";
import Event from "../Pages/Event";
import { PrivateRoute } from "./RouteGuards";
import Explore from "../Pages/Explore";
import AllOffers from "../Pages/AllOffers";
import MyDashboard from "../Pages/MyDashboard";
import EditEvent from "../Pages/EditEvent";
import Wishlist from "../Pages/Wishlist";
import axios from "axios";
import Category from "../Pages/Category";
import City from "../Pages/City";
import Policy from "../Pages/Policy";
import ContactUs from "../Pages/ContactUs";
import TermsConditions from "../Pages/TermsConditions";
import PostOffer from "../Pages/PostOffer";
import MyBookings from "../Pages/MyBookings";
import EventsDashboard from "../Pages/EventsDashboard";
import OffersDashboard from "../Pages/OffersDashboard";
import BookingsDashboard from "../Pages/BookingsDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-in",
        element: <Signin />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/offers",
        element: <AllOffers />,
      },
      {
        path: "/sign-up",
        element: <Signup />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/terms-conditions",
        element: <TermsConditions />,
      },

      {
        path: "/privacy-policy",
        element: <Policy />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/event/:id",
        element: <Event />,
        loader: async ({ params }) => {
          const response = await axios.get(
            `/api/event/all-events/${params.id}`,
          );
          const event = response.data;

          // Replace http with https in image URLs
          if (event.Image && Array.isArray(event.Image)) {
            event.Image = event.Image.map((imageUrl) =>
              imageUrl.startsWith("http:")
                ? imageUrl.replace("http:", "https:")
                : imageUrl,
            );
          }

          return event;
        },
      },
      {
        path: "/category/:type",
        element: <Category />,
      },
      {
        path: "/cities/:state",
        element: <City />,
      },
      {
        path: "/cities/:state/:city",
        element: <City />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
      {
        path: "/",
        element: <PrivateRoute />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/my-bookings",
            element: <MyBookings />,
          },
          {
            path: "/post-event",
            element: <PostEvent />,
          },
          {
            path: "/post-offer",
            element: <PostOffer />,
          },
          {
            path: "/dashboard/events",
            element: <EventsDashboard />,
          },
          {
            path: "/dashboard/offers",
            element: <OffersDashboard />,
          },
          {
            path: "/dashboard/bookings",
            element: <BookingsDashboard />,
          },
          {
            path: "/dashboard",
            element: <MyDashboard />,
          },
          {
            path: "/edit-event/:id",
            element: <EditEvent />,
            loader: async ({ params }) => {
              const response = await axios.get(
                `/api/event/all-events/${params.id}`,
              );
              return response.data;
            },
          },
          {
            path: "/contact-support",
            element: <ContactSupport />,
          },
        ],
      },
    ],
  },
]);

export default router;
