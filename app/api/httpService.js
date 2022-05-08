import axios from "axios";
// import logger from "./logService";
// import { toast } from "react-toastify";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  console.log("intercept...");
  if (expectedError)
    //toast.error(error.response.data.message);
    console.log(error.response.data.message);
  else {
    //logger.log(error);
    //toast.error("An unexpected error occurrred.");
    console.log("An unexpected error occurrred.");
    console.log(error);
  }

  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  return response.data;
});

//function setJwt(jwt) {
//  axios.defaults.headers.common = { Authorization: `Bearer ${jwt}` };
//}

const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  //setJwt,
};

export default http;
