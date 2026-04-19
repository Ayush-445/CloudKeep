"use client";

import { Search, Grid, List } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="flex h-screen bg-[#020617] text-white">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/10 p-4 hidden md:block">
        {sidebar}
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">

          <div className="flex items-center gap-3 w-full max-w-md bg-white/5 px-3 py-2 rounded-xl">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              placeholder="Search files..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          {/* VIEW TOGGLE */}
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg ${
                view === "grid" ? "bg-white/10" : ""
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>

            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg ${
                view === "list" ? "bg-white/10" : ""
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}