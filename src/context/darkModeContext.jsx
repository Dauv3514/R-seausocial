import { createContext, useEffect, useState } from "react";

export const DarkModeContext = createContext();

export const DarkModeContextProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(
        JSON.parse(localStorage.getItem("DarkMode")) || false
    );
    console.log("Dark mode initial:", darkMode);

    const toggle = () => {
        setDarkMode(!darkMode);
    }

    useEffect(() => {
        localStorage.setItem("DarkMode", darkMode);
    }, [darkMode]);

    return (
        <DarkModeContext.Provider value={{ darkMode, toggle }}>
          {children}
        </DarkModeContext.Provider>
      );

};