import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Login/axiosConfig";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/login");
  };

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("/currentuser/me");
        setUser({
          name: res.data.name,
          email: res.data.email,
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 bg-white shadow">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Title and space for Hamburger (already exists in Layout) */}
        <div className="flex items-center space-x-4">
          {/* This space is for hamburger icon, already handled in Layout */}
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Dashboard
          </h1>
        </div>

        {/* Right: Profile dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
              {getInitial(user.name)}
            </div>
            <span className="hidden sm:inline-block text-gray-900 font-medium">
              {user.name}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg z-50">
              <ul className="py-1">
                <li>
                  <button
                    onClick={() => navigate("/layout/profile-info")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
