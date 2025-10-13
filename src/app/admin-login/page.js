"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/login/login";
import { authLogin } from "@/utils/network/api";
import { setAuthCookies } from "@/utils/cookies";
import { useNotification } from "@/providers/notification/notifications";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await authLogin(email, password);

      // Check if we got an auth token
      const authToken = response?.auth_token || response?.token || response?.access_token;

      if (authToken) {
        // Create user object for cookies
        const user = {
          email: email,
          name: response?.user?.name || response?.name || email.split('@')[0]
        };

        // Set cookies and redirect
        setAuthCookies(user, authToken);
        showNotification("success", "Successfully logged in!");
        router.push("/");
      } else {
        showNotification("error", "Login failed. Invalid credentials or server response.");
      }
    } catch (error) {
      let errorMessage;
      if (error.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = "Login failed. Please check your credentials and try again.";
      }
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        <Login onSubmit={handleLogin} loading={loading} />
      </div>
    </div>
  );
}