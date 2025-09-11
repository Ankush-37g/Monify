// utils/api.js
import axios from "axios";

const baseURL = import.meta.env.BACKEND_URL || "http://localhost:5000/api";
// 1️⃣ Create an axios instance (so all API requests share settings)
const api = axios.create({
  baseURL,
  withCredentials: true, // send cookies (accessToken, refreshToken) automatically
});

// 2️⃣ Add an interceptor for responses
api.interceptors.response.use(

  (response) => response,  // if response is OK → just return it

  async (error) => {       // if response is an error → check why

    const originalRequest = error.config; // save request details

    // 3️⃣ Check if error was due to expired access token
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "jwt expired" &&
      !originalRequest._retry   // make sure we don't retry forever
    ) {
      originalRequest._retry = true; // mark that we already retried

      try {
        // 4️⃣ Call backend refresh route
        await axios.post(baseURL + "/user/refresh-token", {}, { withCredentials: true });

        // 5️⃣ Retry the original request with new token
        return api(originalRequest);

      } catch (err) {

        console.error("Refresh failed:", err);

        // 6️⃣ If refresh also fails → log user out
        window.location.href = "/login";
      }
    }

    return Promise.reject(error); // if error was something else
  }
);

export default api;
