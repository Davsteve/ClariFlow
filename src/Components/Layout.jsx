import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const [selectedBusiness, setSelectedBusiness] = useState("");

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] border-r border-slate-800 p-6 flex flex-col">

        <h1 className="text-xl font-semibold tracking-tight text-white mb-10">
          BI SaaS
        </h1>

        <nav className="space-y-3 text-sm">
          <a href="/" className="block px-3 py-2 rounded-lg hover:bg-slate-800 transition">
            Dashboard
          </a>
          <a href="/analytics" className="block px-3 py-2 rounded-lg hover:bg-slate-800 transition">
            Analytics
          </a>
          <a href="/forecast" className="block px-3 py-2 rounded-lg hover:bg-slate-800 transition">
            Forecast
          </a>
          <a href="/advisor" className="block px-3 py-2 rounded-lg hover:bg-slate-800 transition">
            AI Advisor
          </a>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">

          <h2 className="text-2xl font-semibold text-white">
            Business Intelligence
          </h2>

          <select
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Business</option>
            <option value="1">My Business</option>
          </select>

        </div>

        <div className="max-w-7xl mx-auto">
          <Outlet context={{ selectedBusiness }} />
        </div>

      </main>

    </div>
  );
}