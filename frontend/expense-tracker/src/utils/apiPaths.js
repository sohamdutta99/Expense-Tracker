// Base API URL — proxied through Vite in dev, or absolute in production
export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    GET_USER: "/api/v1/auth/getUser",
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  },
  EXPENSE: {
    ADD: "/api/v1/expense/add",
    GET_ALL: "/api/v1/expense/get",
    DELETE: (id) => `/api/v1/expense/${id}`,
    DOWNLOAD_EXCEL: "/api/v1/expense/downloadexcel",
  },
  INCOME: {
    ADD: "/api/v1/income/add",
    GET_ALL: "/api/v1/income/get",
    DELETE: (id) => `/api/v1/income/${id}`,
    DOWNLOAD_EXCEL: "/api/v1/income/downloadexcel",
  },
  DASHBOARD: {
    GET: "/api/v1/dashboard",
  },
};
