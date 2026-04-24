import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import base_url from "../../apis/bootapi";

function SignUpForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${base_url}/authenticate`, formData);

      if (response.status === 200 && response.data.jwtToken) {
       
        const token = response.data.jwtToken;

        localStorage.setItem("token", token);

        localStorage.setItem("isAuthenticated", "true");
         localStorage.setItem("userEmail", formData.username); 

        try {
          const decoded = jwtDecode(token);
          const userRoles = decoded.roles;

          if (userRoles && userRoles.length > 0) {
            localStorage.setItem("userRole", userRoles[0]);
            console.log("User role saved to localStorage:", userRoles[0]);
          } else {
            console.warn("No roles found in JWT token.");
          }
        } catch (decodeError) {
          console.error("Error decoding JWT token:", decodeError);
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setTimeout(() => {
          navigate("/layout/dash");
        }, 100);
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response && error.response.data) {
        setError(error.response.data.message || "Invalid username or password");
      } else if (error.code === "ERR_NETWORK") {
        setError("Network error, please check your connection and try again.");
      } else {
        setError("Server error, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Sign In</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg w-full ${
                loading ? "bg-gray-400" : "bg-blue-500 text-white"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div> */}

      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
            class="mx-auto h-10 w-auto"
          />
          <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} class="space-y-6">
            <div>
              <label
                for="email"
                class="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div class="mt-2">
                   <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
                  autocomplete="email"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label
                  for="password"
                  class="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div class="text-sm">
                  <a
                    href="#"
                    class="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div class="mt-2">
                    <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                  autocomplete="current-password"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
           <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg w-full ${
                loading ? "bg-gray-400" : "bg-blue-500 text-white"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            </div>
          </form>

   
        </div>
      </div>
    </>
  );
}

export default SignUpForm;
