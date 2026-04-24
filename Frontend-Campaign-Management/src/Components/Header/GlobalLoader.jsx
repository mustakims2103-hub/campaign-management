import React from "react";
import { useNavigation } from "react-router";
import Loader from "./Loader"; // your loader component
import { useLocation } from "react-router";
import { useState, useEffect } from "react";


function GlobalLoader({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // Show loader briefly during route change
    return () => clearTimeout(timeout);
  }, [location]);

  return loading ? <Loader /> : children;
}

export default GlobalLoader;
