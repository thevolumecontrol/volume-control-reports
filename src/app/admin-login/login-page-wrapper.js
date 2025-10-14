"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/login/login";
import { authLogin } from "@/utils/network/api";
import authService from "@/utils/auth-service";
import { useNotification } from "@/providers/notification/notifications";

export default function LoginPage() {
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
        // Set cookies and redirect
        const loginSuccess = authService.performLogin(email, authToken);

        if (loginSuccess) {
          showNotification("success", "Successfully logged in!");
          router.push("/");
        } else {
          showNotification("error", "Login failed. Please try again later.");
        }
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