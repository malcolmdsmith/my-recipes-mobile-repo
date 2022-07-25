import { createNavigationContainerRef } from "@react-navigation/native";
import routes from "../navigation/routes";
export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function gotoLogin() {
  if (navigationRef.isReady()) {
    navigationRef.navigate(routes.LOGIN);
  }
}

export function gotoHomeTablet() {
  if (navigationRef.isReady()) {
    navigationRef.navigate(routes.HOME_TABLET);
  }
}
