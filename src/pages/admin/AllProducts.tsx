import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllProducts } from "../../services/productService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { ProductResponse } from "../../types/registration.types";

export default function AllProducts() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const filteredProducts = products.filter((p) => {
    const term = filter.trim().toLowerCase();
    if (!term) return true;
    return (
      (p.name || "").toLowerCase().includes(term) ||
      (p.productCode || "").toLowerCase().includes(term) ||
      (p.category || "").toLowerCase().includes(term)
    );
  });

  const loadProducts = () => {
    setLoading(true);
    getAllProducts()
      .then(setProducts)
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load products."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-ink">All Products</h2>
          <p className="mt-1 text-sm text-slate-500">{products.length} product(s) on record.</p>
        </div>
        <button
          type="button"
          onClick={loadProducts}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-brand-orange hover:text-brand-orange"
        >
          <Icon name="refresh" className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="mt-6">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name, code or category…"
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-6 h-6 text-brand-orange" />
        </div>
      ) : products.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No products found.</p>
      ) : filteredProducts.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No products match "{filter}".</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4">#</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Code</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">DP</th>
                <th className="py-3 pr-4">BV</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, index) => (
                <tr key={p.productGuid} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-3 pr-4 text-slate-500">{index + 1}</td>
                  <td className="py-3 pr-4 font-semibold text-brand-ink">{p.name || "—"}</td>
                  <td className="py-3 pr-4 text-slate-600">{p.productCode || "—"}</td>
                  <td className="py-3 pr-4 text-slate-600">{p.category || "—"}</td>
                  <td className="py-3 pr-4 text-slate-600">{p.dpValue}</td>
                  <td className="py-3 pr-4 text-slate-600">{p.bvValue}</td>
                  <td className="py-3 pr-4 text-right">
                    <Link
                      to={`/admin/products/${p.productGuid}/edit`}
                      className="text-xs font-bold text-brand-orange hover:text-brand-orange-dark hover:underline"
                    >
                      Edit Product
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
