import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getPurchaseItems, getPurchases } from "../../services/registrationService";
import { getPaymentStatuses } from "../../services/sharedService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type {
  PaymentStatusResponse,
  PurchaseItemResponse,
  PurchaseOrderResponse,
} from "../../types/registration.types";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export default function PurchaseDetail() {
  const { mainId } = useParams<{ mainId: string }>();
  const [order, setOrder] = useState<PurchaseOrderResponse | null>(null);
  const [items, setItems] = useState<PurchaseItemResponse[]>([]);
  const [statuses, setStatuses] = useState<PaymentStatusResponse[]>([]);
  const [statusGuid, setStatusGuid] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = Number(mainId);
    if (!mainId || Number.isNaN(id)) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    // There is no "get one order" endpoint, so the order header is found in the full list.
    Promise.all([getPurchases(), getPurchaseItems(id), getPaymentStatuses()])
      .then(([orders, orderItems, paymentStatuses]) => {
        const found = orders.find((o) => o.main_id === id);
        if (!found) {
          setNotFound(true);
          return;
        }
        setOrder(found);
        setItems(orderItems);
        setStatuses(paymentStatuses);
        setStatusGuid(found.payment_status_guid ?? "");
      })
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load order details."))
      .finally(() => setLoading(false));
  }, [mainId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-16">
        <Spinner className="w-6 h-6 text-brand-orange" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-brand-ink">Order not found</h2>
        <Link to="/admin/purchased-product" className="mt-4 inline-block text-sm font-bold text-brand-orange hover:underline">
          Back to Purchased Product
        </Link>
      </div>
    );
  }

  const fullName = `${order.user_first_name ?? ""} ${order.user_last_name ?? ""}`.trim();
  const itemsTotal = items.reduce((sum, item) => sum + item.line_total, 0);

  const fields: [string, string][] = [
    ["Order ID", `#${order.main_id}`],
    ["Order Date", formatDate(order.created_date)],
    ["User", fullName || "—"],
    ["Username", order.user_name || "—"],
    ["Email", order.email_id || "—"],
    ["Mobile", order.mobile_number ? String(order.mobile_number) : "—"],
    ["Items", String(order.item_count)],
    ["Total Amount", String(order.total_amount)],
    ["Payment Mode", order.payment_mode || "—"],
    ["Payment Status", order.payment_status_name || order.payment_status_code || "—"],
    ["Approval Date", formatDate(order.approval_date)],
  ];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <Link
        to="/admin/purchased-product"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-orange"
      >
        <Icon name="arrowRight" className="w-3.5 h-3.5 rotate-180" />
        Back to Purchased Product
      </Link>
      <h2 className="mt-3 text-xl font-bold text-brand-ink">Order #{order.main_id}</h2>

      <dl className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 rounded-xl bg-slate-50 p-5 text-sm">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="font-semibold text-brand-ink break-words">{value}</dd>
          </div>
        ))}
        <div className="sm:col-span-2 lg:col-span-3">
          <dt className="text-xs text-slate-500">User Remark</dt>
          <dd className="font-semibold text-brand-ink break-words">{order.user_remark || "—"}</dd>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <dt className="text-xs text-slate-500">Admin Remark</dt>
          <dd className="font-semibold text-brand-ink break-words">{order.admin_remark || "—"}</dd>
        </div>
      </dl>

      <h3 className="mt-8 text-sm font-bold text-brand-ink">Products</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-500">
              <th className="py-3 pr-4">#</th>
              <th className="py-3 pr-4">Product</th>
              <th className="py-3 pr-4">Code</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4 text-right">Price (BV)</th>
              <th className="py-3 pr-4 text-right">Quantity</th>
              <th className="py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b border-slate-50">
                <td className="py-3 pr-4 text-slate-500">{index + 1}</td>
                <td className="py-3 pr-4 font-semibold text-brand-ink">
                  {item.name || "—"}
                  {item.size && <span className="ml-1 font-normal text-slate-400">({item.size})</span>}
                </td>
                <td className="py-3 pr-4 text-slate-600">{item.product_code || "—"}</td>
                <td className="py-3 pr-4 text-slate-600">{item.category || "—"}</td>
                <td className="py-3 pr-4 text-right text-slate-600">{item.amount}</td>
                <td className="py-3 pr-4 text-right text-slate-600">{item.quantity}</td>
                <td className="py-3 text-right font-semibold text-brand-ink">{item.line_total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="pt-4 pr-4 text-right text-sm font-bold text-slate-500">
                Total Amount
              </td>
              <td className="pt-4 text-right text-lg font-extrabold text-brand-orange">{itemsTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-8 max-w-xs">
        <label htmlFor="payment-status" className="text-sm font-semibold text-brand-ink">
          Payment Status
        </label>
        <select
          id="payment-status"
          value={statusGuid}
          onChange={(e) => setStatusGuid(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
        >
          {!statusGuid && <option value="">Select status</option>}
          {statuses.map((s) => (
            <option key={s.status_guid} value={s.status_guid ?? ""}>
              {s.name ?? s.code}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-slate-400">
          Saving a new payment status isn't available yet — the backend has no API for it.
        </p>
      </div>
    </div>
  );
}
