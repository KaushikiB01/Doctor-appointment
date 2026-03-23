const rawApiUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").trim();

export const API_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;
