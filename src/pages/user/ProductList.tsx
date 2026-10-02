import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllProducts } from "../../services/productService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { ProductResponse } from "../../types/registration.types";
import type { CartItem } from "./Cart";

const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  // Selected quantity per product guid; "" means nothing chosen yet.
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  const selectedCount = products.filter((p) => quantities[p.productGuid]).length;

  const handleBuy = () => {
    const items: CartItem[] = products
      .filter((p) => quantities[p.productGuid])
      .map((p) => ({
        productGuid: p.productGuid,
        name: p.name ?? "",
        price: p.bvValue,
        quantity: Number(quantities[p.productGuid]),
      }));
    if (items.length === 0) return;
    navigate("/dashboard/cart", { state: { items } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-16">
        <Spinner className="w-6 h-6 text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-brand-ink">Product List</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose a quantity for each product you want, then press Buy Product.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No products found.</p>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div
              key={p.productGuid}
              className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden"
            >
              {p.image && (
                <div className="flex items-center justify-center bg-white p-4">
                  <img src={p.image} alt={p.name ?? ""} className="h-32 w-full object-contain" />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-orange/10 px-2.5 py-1 text-[10px] font-bold text-brand-orange">
                  <Icon name="sparkle" className="w-3 h-3" />
                  {p.category || "Product"}
                </span>
                <h3 className="mt-2 text-sm font-bold text-brand-ink">{p.name}</h3>
                <p className="text-xs font-semibold text-slate-400">{p.size}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">{p.description}</p>

                <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-slate-600">
                      DP&nbsp;<span className="text-brand-ink">{p.dpValue}</span>
                    </span>
                    <span className="rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold text-brand-orange">
                      Price (BV)&nbsp;<span className="text-brand-ink">{p.bvValue}</span>
                    </span>
                  </div>
                  <select
                    value={quantities[p.productGuid] ?? ""}
                    onChange={(e) => setQuantities((q) => ({ ...q, [p.productGuid]: e.target.value }))}
                    aria-label={`Quantity for ${p.name}`}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 focus:border-brand-orange focus:outline-none"
                  >
                    <option value="">Qty</option>
                    {QUANTITY_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={handleBuy}
            disabled={selectedCount === 0}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-orange px-8 py-5 text-lg font-extrabold text-white shadow-lg transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buy Product{selectedCount > 0 ? ` (${selectedCount})` : ""}
            <Icon name="arrowRight" className="w-6 h-6" />
          </button>
          {selectedCount === 0 && (
            <p className="mt-2 text-center text-xs text-slate-400">Select a quantity for at least one product to continue.</p>
          )}
        </div>
      )}
    </div>
  );
}
