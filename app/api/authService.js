import APIKit from "./apiKit";

const apiEndpoint = "/users/authenticate";

export async function authenticateUser(username, password) {
  const token = await APIKit.post(apiEndpoint, { username, password });
  return token;
}
