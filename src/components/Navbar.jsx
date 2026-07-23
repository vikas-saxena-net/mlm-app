import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/img/logo.jpeg";
import Icon from "./Icon";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/business-plan", label: "Business Plan" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="tricolor-bar h-1 w-full" />
      <nav className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-24">
        <NavLink to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <img src={logo} alt="HIO Health" className="h-20 w-auto object-contain" />
        </NavLink>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-colors ${
                  isActive ? "text-brand-orange" : "text-brand-ink hover:text-brand-orange"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `text-sm font-semibold tracking-wide transition-colors ${
                isActive ? "text-brand-orange" : "text-brand-ink hover:text-brand-orange"
              }`
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/join"
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-green-dark"
          >
            Join Free
            <Icon name="arrowRight" className="w-4 h-4" />
          </NavLink>
        </div>

        <button
          className="lg:hidden p-2 text-brand-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <Icon name={open ? "close" : "menu"} className="w-7 h-7" />
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pb-6 pt-2">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-sm font-semibold ${
                    isActive ? "bg-orange-50 text-brand-orange" : "text-brand-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-3 text-sm font-semibold ${
                  isActive ? "bg-orange-50 text-brand-orange" : "text-brand-ink"
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/join"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-5 py-3 text-sm font-bold text-white"
            >
              Join Free
              <Icon name="arrowRight" className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
