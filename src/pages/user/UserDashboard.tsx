import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Icon from "../../components/Icon";

const cards = [
  { to: "/dashboard/profile", label: "Edit Profile", icon: "users", desc: "Update your account details." },
  { to: "/dashboard/change-password", label: "Change Password", icon: "shield", desc: "Update your login password." },
  { to: "/dashboard/products", label: "Product List", icon: "gift", desc: "Browse the HIO Health product catalog." },
  { to: "/dashboard/purchased-product", label: "Purchased Product", icon: "bonus", desc: "View the products you have ordered." },
];

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-brand-ink">Welcome, {user?.user_name}</h2>
        <p className="mt-1 text-sm text-slate-500">This is your HIO Health member dashboard.</p>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
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
