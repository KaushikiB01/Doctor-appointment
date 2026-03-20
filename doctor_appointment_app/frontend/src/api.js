const rawApiUrl = (process.env.REACT_APP_API_URL || "/api").trim();

export const API_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;
