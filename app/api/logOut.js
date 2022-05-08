import * as settings from "../config/settings";
import localStorage from "@react-native-async-storage/async-storage";

export async function logOut() {
  await localStorage.removeItem(settings.tokenKey);
}
