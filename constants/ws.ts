const WS_URL =
  (process.env.EXPO_PUBLIC_WS_URL as string) ||
  "wss://mababa-api.onrender.com/ws/";

export default WS_URL;
