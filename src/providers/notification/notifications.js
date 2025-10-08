"use client";
import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ type, message });

    setTimeout(() => {
      setVisible(true); // Apply 'show' class
    }, 10);

    setTimeout(() => {
      setVisible(false); // Remove 'show' class (fade-out)
      setTimeout(() => setNotification(null), 300);
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div
          className={`notification ${visible ? "show" : ""} ${
            notification.type
          }`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}
