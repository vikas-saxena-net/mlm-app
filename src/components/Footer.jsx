import { Link } from "react-router-dom";
import logo from "../assets/img/logo.jpeg";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <img src={logo} alt="HIO Health" className="h-16 w-auto object-contain bg-white rounded-lg p-2" />
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            Be Healthy. We Wealthy. We Happy. Achieve Your Dreams — with Health Care, Personal Care & Agri Care
            products and a rewarding business plan.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/" className="hover:text-brand-orange">Home</Link></li>
            <li><Link to="/products" className="hover:text-brand-orange">Products</Link></li>
            <li><Link to="/business-plan" className="hover:text-brand-orange">Business Plan</Link></li>
            <li><Link to="/about" className="hover:text-brand-orange">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Product Categories</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Health Care</li>
            <li>Personal Care</li>
            <li>Agri Care</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Icon name="phone" className="w-4 h-4 text-brand-orange shrink-0" />
              +91 00000 00000
            </li>
            <li className="flex items-center gap-2">
              <Icon name="mail" className="w-4 h-4 text-brand-orange shrink-0" />
              support@hiohealth.com
            </li>
            <li className="flex items-start gap-2">
              <Icon name="mapPin" className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
              Near Tahsil, Singahi Road, Neghasan, Dist. Lakhimpur Kheri, Uttar Pradesh - 262903
            </li>
          </ul>
        </div>
      </div>

      <div className="tricolor-bar h-1 w-full" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/60">
        <p>&copy; {new Date().getFullYear()} HIO Health Pvt. Ltd. · FSSAI Lic. No. 10825999000777</p>
        <p>Follow &nbsp;•&nbsp; Focus &nbsp;•&nbsp; Direction</p>
      </div>
    </footer>
  );
}
