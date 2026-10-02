import DashboardLayout, { type DashboardMenuItem } from "./DashboardLayout";

const ADMIN_MENU: DashboardMenuItem[] = [
  { to: "/admin", label: "Dashboard", icon: "home", end: true },
  { to: "/admin/add-state", label: "Add State", icon: "mapPin" },
  { to: "/admin/states", label: "All States", icon: "flag" },
  { to: "/admin/add-city", label: "Add City", icon: "compass" },
  { to: "/admin/cities", label: "All Cities", icon: "storefront" },
  { to: "/admin/profile", label: "Edit Profile", icon: "users" },
  { to: "/admin/change-password", label: "Change Password", icon: "shield" },
  { to: "/admin/users", label: "All Users", icon: "target" },
  { to: "/admin/products", label: "Products", icon: "gift" },
];

export default function AdminLayout() {
  return <DashboardLayout title="Admin Panel" menuItems={ADMIN_MENU} />;
}
