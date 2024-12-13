import React from "react";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white dark:bg-darkPrimary z-50">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 border-4 border-t-primary border-r-secondary border-b-primary border-l-secondary rounded-full animate-spin"></div>
        <div className="absolute w-24 h-24 border-4 border-t-secondary border-r-primary border-b-secondary border-l-primary rounded-full animate-spin-reverse"></div>
      </div>
    </div>
  );
};

export default Loader;