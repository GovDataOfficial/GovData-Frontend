export const API_ENDPOINTS_AUTH_BASE = "/api/auth";
export const API_ENDPOINTS_METADATA_BASE = "/api/metadata";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_ENDPOINTS_AUTH_BASE}/login`,
    LOGOUT: `${API_ENDPOINTS_AUTH_BASE}/logout`,
    CALLBACK: `${API_ENDPOINTS_AUTH_BASE}/callback`,
  },
  METADATA: {
    DELETE: `${API_ENDPOINTS_METADATA_BASE}/delete`,
    CREATE: `${API_ENDPOINTS_METADATA_BASE}/create`,
    EDIT: `${API_ENDPOINTS_METADATA_BASE}/edit`,
  },
};
