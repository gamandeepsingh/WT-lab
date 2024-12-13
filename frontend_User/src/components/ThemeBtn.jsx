import React from "react";
import useTheme from "../contexts/theme";
import { FaSun, FaMoon } from "react-icons/fa";

function ThemeBtn() {
  const { themeMode, darkTheme, lightTheme } = useTheme();

  const onChangeTheme = () => {
    if (themeMode === "light") {
      darkTheme(); // Call darkTheme function from context
    } else {
      lightTheme(); // Call lightTheme function from context
    }
  };

  return (
    <button
      className="flex items-center dark:border-gray-600 border rounded-md py-1 text-xs px-3 focus:outline-none"
      onClick={onChangeTheme}
    >
      {themeMode === "light" ? (
        <>
          <FaSun className="text-gray-500" />
          <span className="sr-only">Switch to Dark Mode</span>
        </>
      ) : (
        <>
          <FaMoon className="text-primary" />
          <span className="sr-only">Switch to Light Mode</span>
        </>
      )}
    </button>
  );
}

export default ThemeBtn;
