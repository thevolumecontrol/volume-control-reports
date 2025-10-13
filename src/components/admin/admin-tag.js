"use client";
import { useState, useEffect } from "react";
import Button from "@/uikit/button/button";
import { getCookie } from "@/utils/cookies";

export default function AdminTag() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for auth token in cookies
    const authToken = getCookie("auth_token");
    setIsAuthenticated(!!authToken);
  }, []);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button variant="tag" size="tag">
      admin
    </Button>
  );
}