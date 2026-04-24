  import axios from "axios";

  const instance = axios.create({
    baseURL: "http://localhost:9090", 
  });

  // Add a request interceptor to include the token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
              console.log("Request Headers mahi:", config.headers); // Log headers to check

      }
    

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle response errors globally
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  export default instance;
