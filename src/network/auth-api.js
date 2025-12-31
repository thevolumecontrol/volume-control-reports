import createApiClient, { API_URL } from "./network";

const AUTH_API_KEY = process.env.NEXT_PUBLIC_AUTH_API_KEY;
const BASE_URL = `${API_URL.replace(/\/$/, "")}/${AUTH_API_KEY}`;

const request = createApiClient(BASE_URL);

export const endpoints = {
  authLogin: "auth/login",
};

export async function authLogin(email, password) {
  const body = {
    email: String(email || ""),
    password: String(password || ""),
  };

  return request(endpoints.authLogin, {
    method: "POST",
    data: body,
  });
}
