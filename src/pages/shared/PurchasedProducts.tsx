import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { getPurchaseItems, getPurchases } from "../../services/registrationService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { PurchaseItemResponse, PurchaseOrderResponse } from "../../types/registration.types";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

interface PurchasedProductsProps {
  /** Admin view: lists every user's orders (no user filter) with the buyer's details and remarks. */
  admin?: boolean;
}

export default function PurchasedProducts({ admin = false }: PurchasedProductsProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<PurchaseOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const [itemsByOrder, setItemsByOrder] = useState<Record<number, PurchaseItemResponse[]>>({});
  const [loadingItemsId, setLoadingItemsId] = useState<number | null>(null);

  const loadOrders = () => {
    if (!admin && !user?.user_guid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // Users only ever see their own orders; admins get everything.
    getPurchases(admin ? undefined : user?.user_guid ?? undefined)
      .then(setOrders)
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load purchased products."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin, user?.user_guid]);

  const handleDetails = async (order: PurchaseOrderResponse) => {
    if (openId === order.main_id) {
      setOpenId(null);
      return;
    }
    setOpenId(order.main_id);
    if (itemsByOrder[order.main_id]) return;

    setLoadingItemsId(order.main_id);
    try {
      const items = await getPurchaseItems(order.main_id);
      setItemsByOrder((prev) => ({ ...prev, [order.main_id]: items }));
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Could not load order details.");
      setOpenId(null);
    } finally {
      setLoadingItemsId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-ink">Purchased Product</h2>
          <p className="mt-1 text-sm text-slate-500">
            {orders.length} order(s) {admin ? "on record" : "placed"}.
          </p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-brand-orange hover:text-brand-orange"
        >
          <Icon name="refresh" className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-brand-orange" />
        </div>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">
          {admin ? "No orders have been placed yet." : "You haven't purchased anything yet."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className={`w-full text-left text-sm ${admin ? "min-w-[1400px]" : "min-w-[640px]"}`}>
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4">Order ID</th>
                <th className="py-3 pr-4">Date</th>
                {admin && (
                  <>
                    <th className="py-3 pr-4">User</th>
                    <th className="py-3 pr-4">Username</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Mobile</th>
                  </>
                )}
                <th className="py-3 pr-4 text-right">Items</th>
                <th className="py-3 pr-4 text-right">Total</th>
                <th className="py-3 pr-4">Payment Mode</th>
                <th className="py-3 pr-4">Status</th>
                {admin && <th className="py-3 pr-4">User Remark</th>}
                {admin && <th className="py-3 pr-4">Admin Remark</th>}
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isOpen = openId === order.main_id;
                const items = itemsByOrder[order.main_id];
                const userFullName = `${order.user_first_name ?? ""} ${order.user_last_name ?? ""}`.trim();
                return (
                  <Fragment key={order.main_id}>
                    <tr className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 pr-4 font-semibold text-brand-ink">#{order.main_id}</td>
                      <td className="py-3 pr-4 text-slate-600">{formatDate(order.created_date)}</td>
                      {admin && (
                        <>
                          <td className="py-3 pr-4 font-semibold text-brand-ink">{userFullName || "—"}</td>
                          <td className="py-3 pr-4 text-slate-600">{order.user_name || "—"}</td>
                          <td className="py-3 pr-4 text-slate-600">{order.email_id || "—"}</td>
                          <td className="py-3 pr-4 text-slate-600">{order.mobile_number || "—"}</td>
                        </>
                      )}
                      <td className="py-3 pr-4 text-right text-slate-600">{order.item_count}</td>
                      <td className="py-3 pr-4 text-right font-semibold text-brand-ink">{order.total_amount}</td>
                      <td className="py-3 pr-4 text-slate-600">{order.payment_mode || "—"}</td>
                      <td className="py-3 pr-4 text-slate-600">
                        {order.payment_status_name || order.payment_status_code || "—"}
                        {admin &&
                          order.payment_status_code &&
                          order.payment_status_code !== order.payment_status_name && (
                            <span className="ml-1 text-xs text-slate-400">({order.payment_status_code})</span>
                          )}
                      </td>
                      {admin && <td className="py-3 pr-4 text-slate-600 max-w-[220px] break-words">{order.user_remark || "—"}</td>}
                      {admin && <td className="py-3 pr-4 text-slate-600 max-w-[220px] break-words">{order.admin_remark || "—"}</td>}
                      <td className="py-3 text-right">
                        {admin ? (
                          <Link
                            to={`/admin/purchased-product/${order.main_id}`}
                            className="text-xs font-bold text-brand-orange hover:text-brand-orange-dark hover:underline"
                          >
                            Details
                          </Link>
                        ) : (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDetails(order);
                            }}
                            className="text-xs font-bold text-brand-orange hover:text-brand-orange-dark hover:underline"
                          >
                            {isOpen ? "Hide Details" : "Details"}
                          </a>
                        )}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b border-slate-50 bg-slate-50/60">
                        <td colSpan={7} className="px-4 py-4">
                          {loadingItemsId === order.main_id || !items ? (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Spinner className="w-4 h-4 text-brand-orange" />
                              Loading details…
                            </div>
                          ) : (
                            <div>
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                    <th className="py-2 pr-4">Product</th>
                                    <th className="py-2 pr-4">Category</th>
                                    <th className="py-2 pr-4 text-right">Price (BV)</th>
                                    <th className="py-2 pr-4 text-right">Quantity</th>
                                    <th className="py-2 text-right">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {items.map((item) => (
                                    <tr key={item.id} className="border-t border-slate-100">
                                      <td className="py-2 pr-4 font-semibold text-brand-ink">
                                        {item.name || "—"}
                                        {item.size && <span className="ml-1 font-normal text-slate-400">({item.size})</span>}
                                      </td>
                                      <td className="py-2 pr-4 text-slate-600">{item.category || "—"}</td>
                                      <td className="py-2 pr-4 text-right text-slate-600">{item.amount}</td>
                                      <td className="py-2 pr-4 text-right text-slate-600">{item.quantity}</td>
                                      <td className="py-2 text-right font-semibold text-brand-ink">{item.line_total}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="mt-3 space-y-1 text-xs text-slate-600">
                                {order.user_remark && (
                                  <p>
                                    <span className="font-bold text-slate-500">Your remark:</span> {order.user_remark}
                                  </p>
                                )}
                                {order.admin_remark && (
                                  <p>
                                    <span className="font-bold text-slate-500">Admin remark:</span> {order.admin_remark}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
