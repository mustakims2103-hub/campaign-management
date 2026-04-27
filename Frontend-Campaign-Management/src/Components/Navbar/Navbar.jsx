import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChartBarIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import SupportModal from "../Supports/SupportModal";

const BullseyeIcon = () => (
  <svg
    className="h-5 w-5 mr-2 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" strokeWidth="2" />
  </svg>
);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const [showSupport, setShowSupport] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const handleSupportSubmit = () => {
    console.log("Support message submitted:", supportMessage);
    setShowSupport(false);
    setSupportMessage("");
  };

  const navigation = [
    { name: "Dashboard", href: "/layout/dash", icon: "chart-bar" },
    { name: "Campaigns", href: "/layout/campaigns", icon: "bullseye" },
    { name: "Landing Pages", href: "/layout/lp", icon: "globe-alt" },
    { name: "Supports", href: "/layout/SupportModal", icon: "wrench-screwdriver", isSupport: true },
  ];

  if (userRole === "ROLE_admin") {
    navigation.push(
      { name: "Add Assignee Employee", href: "/layout/AddAssignee", icon: "users" },
      { name: "Add User", href: "/layout/AddUserLogin", icon: "key" }
    );
  }

  const icons = {
    "chart-bar": <ChartBarIcon className="h-5 w-5 mr-2" />,
    "globe-alt": <GlobeAltIcon className="h-5 w-5 mr-2" />,
    "wrench-screwdriver": <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />,
    users: <UsersIcon className="h-5 w-5 mr-2" />,
    key: <UsersIcon className="h-5 w-5 mr-2" />,
    bullseye: <BullseyeIcon />,
  };

  if (userRole === null) return null;

  return (
    <>
      <nav className="bg-gray-800 text-white min-h-screen fixed rounded-[2vw] w-50">
        <div className="flex flex-col items-center py-4">
          <div className="mb-6">
            <img
              alt="Distinct Digital Media"
              src="https://distinctdigitalmedia.com/images/logo.png"
              className="h-12 w-12"
            />
          </div>

          <div className="w-full">
            {navigation.map((item) =>
              item.isSupport ? (
                <div
                  key={item.name}
                  onClick={() => setShowSupport(true)}
                  className="cursor-pointer flex items-center py-2 px-4 text-sm font-medium rounded-md my-2 hover:bg-gray-700 text-gray-300 hover:text-white"
                >
                  {icons[item.icon]}
                  {item.name}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "flex items-center py-2 px-4 text-sm font-medium rounded-md my-2"
                  )}
                >
                  {icons[item.icon]}
                  {item.name}
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      <SupportModal
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
        onSubmit={handleSupportSubmit}
        message={supportMessage}
        setMessage={setSupportMessage}
      />
    </>
  );
}
