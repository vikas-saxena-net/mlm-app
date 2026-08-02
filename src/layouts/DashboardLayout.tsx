import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Icon from "../components/Icon";

export interface DashboardMenuItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

interface DashboardLayoutProps {
  title: string;
  menuItems: DashboardMenuItem[];
}

export default function DashboardLayout({ title, menuItems }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid lg:grid-cols-[240px_1fr] gap-6">
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-ink"
        >
          <Icon name="menu" className="w-4 h-4" />
          {title} Menu
        </button>

        <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="px-2 py-2 mb-2 border-b border-slate-100">
              <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
              <p className="text-sm font-bold text-brand-ink truncate">{user?.user_name}</p>
            </div>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isActive ? "bg-orange-50 text-brand-orange" : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  <Icon name={item.icon} className="w-4 h-4 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={logout}
                className="mt-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
              >
                <Icon name="close" className="w-4 h-4 shrink-0" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
