import { Link, useLocation } from "react-router-dom";
import Icon from "../../components/Icon";
import type { CheckoutResponse } from "../../types/registration.types";

export default function CheckoutSuccess() {
  const location = useLocation();
  const state = location.state as { order?: CheckoutResponse; paid?: boolean } | null;
  const order = state?.order;
  const paid = state?.paid === true;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 md:p-12 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-brand-green">
        <Icon name="check" className="w-8 h-8" strokeWidth={2.5} />
      </div>
      <h2 className="mt-5 text-2xl font-extrabold text-brand-ink">
        {paid ? "Payment successful!" : "Order placed successfully!"}
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        {paid ? "Your payment was received. Thank you for your purchase." : "Thank you for your purchase."}
      </p>

      {order && (
        <dl className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-x-6 gap-y-3 rounded-xl bg-slate-50 p-5 text-left text-sm">
          <dt className="text-slate-500">Order ID</dt>
          <dd className="font-semibold text-brand-ink">{order.id}</dd>
          <dt className="text-slate-500">Items</dt>
          <dd className="font-semibold text-brand-ink">{order.item_count}</dd>
          <dt className="text-slate-500">Total Amount</dt>
          <dd className="font-semibold text-brand-ink">{order.total_amount}</dd>
          <dt className="text-slate-500">Payment Mode</dt>
          <dd className="font-semibold text-brand-ink">{order.payment_mode}</dd>
        </dl>
      )}

      <Link
        to="/dashboard/products"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-orange-dark"
      >
        Continue Shopping
        <Icon name="arrowRight" className="w-4 h-4" />
      </Link>
    </div>
  );
}
