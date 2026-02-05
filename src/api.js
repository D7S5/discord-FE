import axios from "axios";

axios.defaults.withCredentials = true;


const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

let refreshPromise = null;
let requestQueue = [];

function resolveQueue(token) {
  requestQueue.forEach(p => p.resolve(token));
  requestQueue = [];
}

function rejectQueue(error) {
  requestQueue.forEach(p => p.reject(error));
  requestQueue = [];
}

api.interceptors.request.use((config) => {
  // login / refresh / logout 요청에는 토큰 안 붙임
  if (config.url?.startsWith("/auth")) {
    return config;
  }

  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {

    const original = error.config;
    const status = error.response?.status;

    if (!original) {
      return Promise.reject(error);
    }

    // auth 관련 요청은 refresh 대상 
    if (original.url?.startsWith("/auth")) {
      return Promise.reject(error);
    }

    if ((status !== 401 && status !== 403 ) || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    // refresh 중이면 큐 대기
    if (refreshPromise) {
      return new Promise((resolve, reject) => {
        requestQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    // refresh 시작
    refreshPromise = refreshApi
      .post("/auth/refresh")
      .then((res) => {
        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        resolveQueue(newToken);
        return newToken;
      })
      .catch((err) => {
        rejectQueue(err);
        logout();
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });

    const newToken = await refreshPromise;
    original.headers.Authorization = `Bearer ${newToken}`;
    return api(original);
  }
);
export async function logout() {
  try {
    await refreshApi.post("/auth/logout");
  } catch (_) {}

  localStorage.clear();
  window.location.href = "/";
}

export default api;
