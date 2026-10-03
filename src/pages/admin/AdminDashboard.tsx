import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Icon from "../../components/Icon";

const cards = [
  { to: "/admin/purchased-product", label: "Purchased Product", icon: "bonus", desc: "View every order placed by members." },
  { to: "/admin/create-genealogy", label: "Create Genealogy", icon: "pair", desc: "Active members still waiting for a user code." },
  { to: "/admin/show-genealogy", label: "Show Genealogy", icon: "users", desc: "See the binary tree, three levels at a time." },
  { to: "/admin/add-state", label: "Add State", icon: "mapPin", desc: "Create a new state under a country." },
  { to: "/admin/states", label: "All States", icon: "flag", desc: "View and delete existing states." },
  { to: "/admin/add-city", label: "Add City", icon: "compass", desc: "Create a new city under a state." },
  { to: "/admin/cities", label: "All Cities", icon: "storefront", desc: "View and delete existing cities." },
  { to: "/admin/profile", label: "Edit Profile", icon: "users", desc: "Update your account details." },
  { to: "/admin/change-password", label: "Change Password", icon: "shield", desc: "Update your login password." },
  { to: "/admin/users", label: "Users List", icon: "target", desc: "View every registered member." },
  { to: "/admin/products", label: "Products", icon: "gift", desc: "View and edit existing products." },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-brand-ink">Welcome, {user?.user_name}</h2>
        <p className="mt-1 text-sm text-slate-500">You're signed in as an administrator.</p>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <Icon name={c.icon} className="w-5 h-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-brand-ink">{c.label}</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
