import DashboardLayout, { type DashboardMenuItem } from "./DashboardLayout";

const USER_MENU: DashboardMenuItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: "home", end: true },
  { to: "/dashboard/profile", label: "Edit Profile", icon: "users" },
  { to: "/dashboard/change-password", label: "Change Password", icon: "shield" },
];

export default function UserLayout() {
  return <DashboardLayout title="My Account" menuItems={USER_MENU} />;
}
