import { Routes, Route } from "react-router-dom";
import { useBusiness } from "./context/BusinessContext";
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Forecast from "./pages/Forecast";
import Advisor from "./pages/Advisor"; // ✅ NEW
import Auth from "./pages/Auth";

export default function App() {
  const { session, loading } = useBusiness();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return <Auth />;
  }

  return (
  <div
  style={{
    display: "flex",
    minHeight: "100vh",
    background: "#0B1120",
    color: "#e2e8f0",
    width: "100vw",        // ← ADD THIS
    overflow: "hidden",    // ← ADD THIS
  }}
>
    <Sidebar collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} />

    <div
  style={{
    flex: 1,
    minWidth: 0,          // ← THIS FIXES RECHARTS
    padding: "40px",
    transition: "all 0.3s ease",
  }}
>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/advisor" element={<Advisor />} />
      </Routes>
    </div>
  </div>
);
}