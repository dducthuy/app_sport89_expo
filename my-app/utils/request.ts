import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_DOMAIN = " http://172.20.10.6:3001/api-docs/";

const instance = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;