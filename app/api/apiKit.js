import axios from "axios";
import Constants from "expo-constants";
import { logOut } from "../api/logOut";
import { gotoLogin } from "../tablet/RootNavigation";

// Create axios client, pre-configured with baseURL
let APIKit = axios.create({
  //baseURL: Constants.isDevice
  //  ? "http://192.168.1.4:4000/api"
  //  : "http://localhost:4000/api",
  //baseURL: "http://localhost:4000/api",
  baseURL: "http://my-recipes-13442.nodechef.com/api",
  timeout: 10000,
});

APIKit.interceptors.response.use(
  (response) => {
    //
    return response.data;
  },
  (error) => {
    console.info("Error.Response...", error.response.status);
    if (error.response.status === 401) {
      console.info("401 logging out - gotoLogin");
      logOut();
      gotoLogin();
    }
  }
);

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = (token) => {
  delete APIKit.defaults.headers.common["Authorization"];
  const stripped = token.replace(/\"/g, "");
  APIKit.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${stripped}`;
    return config;
  });
};

export default APIKit;
