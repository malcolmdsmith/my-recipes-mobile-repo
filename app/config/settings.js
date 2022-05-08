import Constants from "expo-constants";

const settings = {
  dev: {
    apiUrl: "https://wwii-model-aircraft-api-13442.nodechef.com/api",
  },
  staging: {
    apiUrl: "https://wwii-model-aircraft-api-13442.nodechef.com/api",
  },
  prod: {
    apiUrl: "https://wwii-model-aircraft-api-13442.nodechef.com/api",
  },
};

export const tokenKey = "token";

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
