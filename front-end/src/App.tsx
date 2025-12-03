// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./components/Login";
import PlannerHome from "./pages/PlannerHome";
import CareerStep from "./pages/CareerPath";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <Routes>
          {/* First page – big orange “UIUC Semester Planner” button */}
          <Route path="/" element={<Landing />} />

          {/* Email/password login page */}
          <Route path="/login" element={<Login />} />

          {/* Step 1 – Select Your Major */}
          <Route
            path="/planner"
            element={
              <ProtectedRoute>
                <PlannerHome />
              </ProtectedRoute>
            }
          />

          {/* Step 2 – Choose Your Career Path */}
          <Route
            path="/career"
            element={
              <ProtectedRoute>
                <CareerStep />
              </ProtectedRoute>
            }
          />

          {/* Fallback: anything else goes to landing */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;



