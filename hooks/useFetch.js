import axios from "axios";
const useFetch = axios.create({
  baseURL: process.env.VUE_APP_API,
});
useFetch.interceptors.request.use(
  async (config) => {
    config.header = config.headers;
    if (localStorage.getItem("token")) {
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

useFetch.interceptors.response.use(function (response) {
  return response;
});
export { useFetch };
