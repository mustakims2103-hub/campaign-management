import React from "react";
import { NavLink, useParams } from "react-router";

const CampaignDetailsNavlink = () => {
  const { id } = useParams();

  const tabs = ["details", "fields", "leads", "imports"];

  return (
    <div className="border-b-cyan-200  mb-5">
      <div className="container mx-auto ">
        <div className="flex space-x-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab}
              to={`/layout/campaign/${tab}/${id}`}
              className={({ isActive }) =>
                `pb-2 text-sm font-medium border-b-2 ${
                  isActive
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300"
                }`
              }
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsNavlink;
