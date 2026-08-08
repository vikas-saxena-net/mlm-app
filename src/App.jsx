import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import BusinessPlan from "./pages/BusinessPlan";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Join from "./pages/Join";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddState from "./pages/admin/AddState";
import AddCity from "./pages/admin/AddCity";
import AllStates from "./pages/admin/AllStates";
import AllCities from "./pages/admin/AllCities";
import AdminUsers from "./pages/admin/AdminUsers";
import UserDashboard from "./pages/user/UserDashboard";
import EditProfile from "./pages/shared/EditProfile";
import ChangePassword from "./pages/shared/ChangePassword";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/business-plan" element={<BusinessPlan />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/join" element={<Join />} />
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="add-state" element={<AddState />} />
                  <Route path="states" element={<AllStates />} />
                  <Route path="add-city" element={<AddCity />} />
                  <Route path="cities" element={<AllCities />} />
                  <Route path="profile" element={<EditProfile />} />
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="users/:usersGuid/profile" element={<EditProfile />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                <Route path="/dashboard" element={<UserLayout />}>
                  <Route index element={<UserDashboard />} />
                  <Route path="profile" element={<EditProfile />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
