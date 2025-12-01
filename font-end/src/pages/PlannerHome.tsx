// src/pages/PlannerHome.tsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const PlannerHome: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-semibold">UIUC Semester Planner</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {user?.email}
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 rounded-md border text-sm"
          >
            Logout
          </button>
        </div>
      </header>
      {/* rest of your planner UI goes here */}
    </div>
  );
};

export default PlannerHome;
