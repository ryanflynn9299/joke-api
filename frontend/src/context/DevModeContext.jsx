import React, { useState, useEffect } from "react";
import { DevModeContext } from "./DevModeContext.js";

export const DevModeProvider = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState(() => {
    const saved = localStorage.getItem("devMode");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("devMode", isDevMode);
  }, [isDevMode]);

  const toggleDevMode = () => setIsDevMode((prev) => !prev);

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
};
