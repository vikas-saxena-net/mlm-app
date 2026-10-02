import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { checkout } from "../../services/registrationService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";

export interface CartItem {
  productGuid: string;
  name: string;
  /** Unit price — the product's BV value. */
  price: number;
  quantity: number;
}

const PAYMENT_MODES = ["Online", "Offline"];
const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState<CartItem[]>(
    () => (location.state as { items?: CartItem[] } | null)?.items ?? []
  );
  const [paymentMode, setPaymentMode] = useState(PAYMENT_MODES[0]);
  const [remark, setRemark] = useState("");

  const isOffline = paymentMode === "Offline";
  // A remark is mandatory for offline payments.
  const canCheckout = !isOffline || remark.trim().length > 0;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (productGuid: string, quantity: number) => {
    const next = items.map((item) => (item.productGuid === productGuid ? { ...item, quantity } : item));
    setItems(next);
    // Keep the edited quantities in history state so they survive a page refresh.
    navigate(location.pathname, { replace: true, state: { items: next } });
  };

  const handleCheckout = async () => {
    if (!user?.user_guid) {
      toast.error("Could not determine your account ID. Please re-login and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const order = await checkout({
        users_guid: user.user_guid,
        total_amount: total,
        payment_mode: paymentMode,
        // The remark box only exists (and is mandatory) for offline payments.
        user_remark: isOffline ? remark.trim() : undefined,
        details: items.map((item) => ({
          product_guid: item.productGuid,
          quantity: item.quantity,
          // The API checks total_amount == sum(quantity x amount), so this is the unit price.
          amount: item.price,
        })),
      });
      navigate("/dashboard/checkout-success", { replace: true, state: { order } });
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-brand-ink">Your cart is empty</h2>
        <p className="mt-2 text-sm text-slate-500">Select products and quantities from the Product List first.</p>
        <Link
          to="/dashboard/products"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-orange-dark"
        >
          Go to Product List
          <Icon name="arrowRight" className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <Link
        to="/dashboard/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-orange"
      >
        <Icon name="arrowRight" className="w-3.5 h-3.5 rotate-180" />
        Back to Product List
      </Link>
      <h2 className="mt-3 text-xl font-bold text-brand-ink">Your Cart</h2>
      <p className="mt-1 text-sm text-slate-500">Review your selected products, adjust quantities, then checkout.</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-500">
              <th className="py-3 pr-4">#</th>
              <th className="py-3 pr-4">Product</th>
              <th className="py-3 pr-4 text-right">Price (BV)</th>
              <th className="py-3 pr-4 text-right">Quantity</th>
              <th className="py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.productGuid} className="border-b border-slate-50">
                <td className="py-3 pr-4 text-slate-500">{index + 1}</td>
                <td className="py-3 pr-4 font-semibold text-brand-ink">{item.name}</td>
                <td className="py-3 pr-4 text-right text-slate-600">{item.price}</td>
                <td className="py-3 pr-4 text-right">
                  <select
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productGuid, Number(e.target.value))}
                    aria-label={`Quantity for ${item.name}`}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 focus:border-brand-orange focus:outline-none"
                  >
                    {QUANTITY_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 text-right font-semibold text-brand-ink">{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="pt-4 pr-4 text-right text-sm font-bold text-slate-500">
                Total Amount
              </td>
              <td className="pt-4 text-right text-lg font-extrabold text-brand-orange">{total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-8 max-w-xs">
        <label htmlFor="payment-mode" className="text-sm font-semibold text-brand-ink">
          Payment Mode
        </label>
        <select
          id="payment-mode"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
        >
          {PAYMENT_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>

      {isOffline && (
        <div className="mt-5 max-w-xl">
          <label htmlFor="remark" className="text-sm font-semibold text-brand-ink">
            Remark<span className="text-red-500 ml-0.5">*</span>
          </label>
          <textarea
            id="remark"
            rows={3}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="e.g. payment method, reference number or note for the offline payment"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />
          {!canCheckout && (
            <p className="mt-1.5 text-xs text-slate-400">A remark is required for offline payment.</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={!canCheckout || submitting}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-orange px-8 py-5 text-lg font-extrabold text-white shadow-lg transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Spinner className="w-6 h-6" />
            Processing...
          </>
        ) : (
          <>
            Checkout
            <Icon name="arrowRight" className="w-6 h-6" />
          </>
        )}
      </button>
    </div>
  );
}
