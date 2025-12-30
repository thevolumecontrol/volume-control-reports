"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie } from "@/utils/cookies";

const UserContext = createContext({
  isVisitor: true,
  setIsVisitor: () => {},
  refreshUserState: () => {},
});

export function UserProvider({ children }) {
  const [isVisitor, setIsVisitor] = useState(true);

  const refreshUserState = () => {
    const authToken = getCookie("auth_token");
    setIsVisitor(!authToken);
  };

  useEffect(() => {
    // Check if user has auth token
    refreshUserState();
  }, []);

  return (
    <UserContext.Provider value={{ isVisitor, setIsVisitor, refreshUserState }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
