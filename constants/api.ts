// constants/api.ts

// Use environment variable if available, otherwise default to online API
const API_URL = (process.env.API_URL as string) || "https://arlande-api.mababa.app";

export default API_URL;
