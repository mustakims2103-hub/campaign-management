import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React from "react";
import Layout from "./Layout.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import MainCampaigns from "./Components/Campaigns/MainCampaigns.jsx";
import LandingPage from "./Components/LandingPage/LandingPage.jsx";
import SupportModal from "./Components/Supports/SupportModal.jsx";
import SignUpForm from "./Components/Login/SignUpForm.jsx";
import AddCampaign from "./Components/Campaigns/AddCampaign.jsx";
import CampaignDetails from "./Components/Campaigns/CampaignDetails.jsx";
import CampaignFields from "./Components/Campaigns/CampaignFields.jsx";
import { BrowserRouter } from "react-router";
import CampaignLeads  from "./Components/Campaigns/CampaignLeads.jsx";
import CampaignImports  from "./Components/Campaigns/CampaignImports.jsx";
import AddAssignee from "./Components/Campaigns/AddAssignee.jsx";
import AddUserLogin from "./Components/Login/AddUserLogin.jsx";
import {jwtDecode} from "jwt-decode"; // Updated import
import 'react-toastify/dist/ReactToastify.css';
import EditCampaign from "./Components/Campaigns/EditCampaign.jsx"
import ProfileInfo from "./Components/Dashboard/ProfileInfo.jsx";
import GlobalLoader from "./Components/Header/GlobalLoader.jsx"


// ProtectedRoute component
function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");


  // Check if token exists
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode the token to verify its structure and validate expiration
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decodedToken.exp < currentTime) {
      // Remove expired token
      localStorage.removeItem("token");
      localStorage.setItem("isAuthenticated", "false");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Invalid token:", error);

    // Remove invalid token
    localStorage.removeItem("token");
    localStorage.setItem("isAuthenticated", "false");
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Define routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<SignUpForm />} />

      {/* Protected Routes */}
     <Route
  path="/layout"
  element={
    <ProtectedRoute>
      <GlobalLoader>
        <Layout />
      </GlobalLoader>
    </ProtectedRoute>
  }
>
        {/* Nested Routes under Layout */}
        <Route path="dash" element={<Dashboard />} />
        <Route path="campaigns" element={<MainCampaigns />} />
        <Route path="lp" element={<LandingPage />} />
        <Route path="profile-info" element={<ProfileInfo />} />
        <Route path="SupportModal" element={<SupportModal />} />
        <Route path="details" element={<CampaignDetails />} />
        <Route path="add-campaign" element={<AddCampaign />} />
         <Route path="add-campaign/:id" element={<AddCampaign />} />
        <Route path="campaign-details/:id" element={<CampaignDetails />} />
        <Route path="addAssignee" element={<AddAssignee />} />
        <Route path="AddUserLogin" element={<AddUserLogin />} />
        <Route path="edit-campaign/:id" element={<EditCampaign />} />
        <Route path="/layout/campaign/details/:id" element={<CampaignDetails />} />
<Route path="/layout/campaign/fields/:id" element={<CampaignFields />} />
<Route path="/layout/campaign/leads/:id" element={<CampaignLeads />} />
<Route path="/layout/campaign/imports/:id" element={<CampaignImports />} />
      </Route>
    </Route>
  )
);

// Render the application
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
