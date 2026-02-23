import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

let refreshing = false;
let pendingQueue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!refreshing) {
        refreshing = true;
        try {
          await api.post("/auth/refresh");
          pendingQueue.forEach((cb) => cb());
          pendingQueue = [];
        } finally {
          refreshing = false;
        }
      }

      await new Promise<void>((resolve) => pendingQueue.push(resolve));
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;
