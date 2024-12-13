import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router.jsx";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a QueryClient instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          {/* Add your components here */}
        </RouterProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);
