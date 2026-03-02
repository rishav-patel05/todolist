import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
});

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.split("=")[1] ?? null;
};

api.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrfToken");
  if (csrfToken) {
    config.headers["x-csrf-token"] = decodeURIComponent(csrfToken);
  }
  return config;
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh")
          .then(() => undefined)
          .finally(() => {
            refreshPromise = null;
          });
      }
      await refreshPromise;
      return api(original);
    }

    if (
      error.response?.status === 403 &&
      !original._csrfRetry &&
      typeof error.response?.data?.message === "string" &&
      error.response.data.message.toLowerCase().includes("csrf")
    ) {
      original._csrfRetry = true;
      await api.get("/auth/csrf");
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;
