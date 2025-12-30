"use client";
import { setAuthCookies } from "./cookies";

// Simplified auth service - only handles cookie management
// State management is now handled by UserProvider
class AuthService {
  // Set auth cookies after login
  performLogin(email, authToken) {
    try {
      setAuthCookies(email, authToken);
      console.log("Login successful:", email);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }

  // Clear auth cookies on logout
  clearAuthCookies() {
    if (typeof document === "undefined") return;

    const expireDate = "Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = `auth_token=; expires=${expireDate}; path=/;`;
    document.cookie = `user_email=; expires=${expireDate}; path=/;`;
  }

  // Perform logout
  performLogout() {
    try {
      this.clearAuthCookies();
      console.log("Logout successful");
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;

// Export logout function for direct import
export function logout() {
  return authService.performLogout();
}
