"use client";
import React from "react";
import { getCookie, setCookie, setAuthCookies } from "./cookies";

class AuthService {
  constructor() {
    this.listeners = new Set();
    this.state = {
      isAuthenticated: false,
      email: null,
      authToken: null,
    };
    this.checkInterval = null;
    this.isHydrated = false;
    
    // Initialize on client side only
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  init() {
    // Initial check and mark as hydrated
    this.checkAuthStatus();
    this.isHydrated = true;
    
    // Start polling for auth changes
    this.startPolling();
    
    // Listen for manual auth events
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('authLogin', () => this.checkAuthStatus());
    window.addEventListener('authLogout', () => this.performLogout());
  }

  checkAuthStatus() {
    if (typeof window === "undefined") return;
    
    const authToken = getCookie("auth_token");
    const emailCookie = getCookie("user_email");

    const newState = {
      isAuthenticated: !!authToken,
      authToken: authToken || null,
      email: emailCookie || null,
    };

    // Only notify if state actually changed
    if (this.hasStateChanged(newState)) {
      this.updateState(newState);
    }
  }

  parseUserCookie(userCookie) {
    if (!userCookie) return null;
    
    try {
      return JSON.parse(userCookie);
    } catch (e) {
      console.warn('Failed to parse user cookie:', e);
      return null;
    }
  }

  hasStateChanged(newState) {
    return (
      this.state.isAuthenticated !== newState.isAuthenticated ||
      this.state.authToken !== newState.authToken ||
      JSON.stringify(this.state.email) !== JSON.stringify(newState.email)
    );
  }

  updateState(newState) {
    this.state = newState;
    this.notifyListeners();
  }

  startPolling() {
    if (this.checkInterval) return;
    
    this.checkInterval = setInterval(() => {
      this.checkAuthStatus();
    }, 2000);
  }

  // === SUBSCRIPTION MANAGEMENT ===

  subscribe(callback) {
    this.listeners.add(callback);
    
    // Call immediately with current or default state
    const currentState = this.isHydrated ? this.state : this.getDefaultState();
    callback(currentState.isAuthenticated, currentState.email, currentState.authToken);
    
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.state.isAuthenticated, this.state.email, this.state.authToken);
      } catch (error) {
        console.error('Auth listener error:', error);
      }
    });
  }

  // === PUBLIC API ===

  getDefaultState() {
    return {
      isAuthenticated: false,
      email: null,
      authToken: null,
    };
  }

  getAuthState() {
    return this.isHydrated ? this.state : this.getDefaultState();
  }

  // === AUTH OPERATIONS ===

  performLogin(email, authToken) {
    try {
      setAuthCookies(email, authToken);
      this.checkAuthStatus();
      console.log('Login successful:', email);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  performLogout() {
    try {
      this.clearAuthCookies();
      this.updateState(this.getDefaultState());
      console.log('Logout successful');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }

  clearAuthCookies() {
    if (typeof document === "undefined") return;
    
    const expireDate = "Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = `auth_token=; expires=${expireDate}; path=/;`;
    document.cookie = `user_email=; expires=${expireDate}; path=/;`;
  }

  // === CLEANUP ===

  destroy() {
    this.stopPolling();
    this.listeners.clear();
    
    if (typeof window !== "undefined") {
      window.removeEventListener('authLogin', this.checkAuthStatus);
      window.removeEventListener('authLogout', this.performLogout);
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;

// React hook for auth state
export function useAuth() {
  const [authState, setAuthState] = React.useState({
    isAuthenticated: false,
    email: null,
    authToken: null,
  });

  React.useEffect(() => {
    const unsubscribe = authService.subscribe((isAuthenticated, email, authToken) => {
      setAuthState({ isAuthenticated, email, authToken });
    });

    return unsubscribe;
  }, []);

  return {
    ...authState,
    // Добавить прямой доступ к состоянию из сервиса если нужно
    getAuthState: authService.getAuthState.bind(authService),
    login: authService.performLogin.bind(authService),
    logout: authService.performLogout.bind(authService),
  };
}