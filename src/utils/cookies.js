import Cookies from "js-cookie";
export { Cookies };

const defaultOptions = { secure: true, sameSite: "Strict" };

export const setCookie = (name, value, options = {}) => {
  Cookies.set(name, value, { ...defaultOptions, ...options });
};

export const getCookie = (name) => Cookies.get(name) || null;

export const removeCookie = (name, options = {}) => {
  Cookies.remove(name, options);
};

export const setAuthCookies = (email, auth_token) => {
  const authPaths = ["/login", "/forgot-password", "/register"];
  const currentPath = window.location.pathname;

  setCookie("auth_token", auth_token);
  setCookie("user_email", email);
};

export const logout = () => {
  removeCookie("auth_token");
  removeCookie("user_email");
};
