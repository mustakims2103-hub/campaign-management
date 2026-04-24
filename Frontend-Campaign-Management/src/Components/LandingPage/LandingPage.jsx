import React, { useState, useEffect } from 'react';

function LandingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay to show loader (e.g., fetching data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Simple CSS loader spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello, this is landing page</h1>
    </div>
  );
}

export default LandingPage;
