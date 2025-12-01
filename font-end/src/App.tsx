import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./components/Login";
import PlannerHome from "./pages/PlannerHome";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <Routes>
          {/* First page – big orange “UIUC Semester Planner” button */}
          <Route path="/" element={<Landing />} />

          {/* Email/password login page (your screenshot) */}
          <Route path="/login" element={<Login />} />

          {/* Main app – only visible after login */}
          <Route
            path="/planner"
            element={
              <ProtectedRoute>
                <PlannerHome />
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



