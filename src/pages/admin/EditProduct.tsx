import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllProducts, updateProduct } from "../../services/productService";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";

interface ProductFormState {
  productCode: string;
  name: string;
  category: string;
  size: string;
  image: string;
  dpValue: string;
  bvValue: string;
  description: string;
  benefits: string;
  usage: string;
}

const EMPTY_FORM: ProductFormState = {
  productCode: "",
  name: "",
  category: "",
  size: "",
  image: "",
  dpValue: "",
  bvValue: "",
  description: "",
  benefits: "",
  usage: "",
};

export default function EditProduct() {
  const { guid } = useParams<{ guid: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!guid) {
      setLoading(false);
      return;
    }
    getAllProducts()
      .then((products) => {
        const product = products.find((p) => p.productGuid === guid);
        if (!product) {
          setNotFound(true);
          return;
        }
        setForm({
          productCode: product.productCode ?? "",
          name: product.name ?? "",
          category: product.category ?? "",
          size: product.size ?? "",
          image: product.image ?? "",
          dpValue: String(product.dpValue ?? ""),
          bvValue: String(product.bvValue ?? ""),
          description: product.description ?? "",
          benefits: (product.benefits ?? []).join("\n"),
          usage: (product.usage ?? []).join("\n"),
        });
      })
      .catch((error: ApiErrorShape) => toast.error(error.message || "Could not load product details."))
      .finally(() => setLoading(false));
  }, [guid]);

  const update = (field: keyof ProductFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!guid) return;
    if (!form.productCode.trim() || !form.name.trim()) {
      toast.error("Product code and name are required.");
      return;
    }
    const dpValue = Number(form.dpValue);
    const bvValue = Number(form.bvValue);
    if (!form.dpValue.trim() || Number.isNaN(dpValue)) {
      toast.error("Enter a valid DP value.");
      return;
    }
    if (!form.bvValue.trim() || Number.isNaN(bvValue)) {
      toast.error("Enter a valid BV value.");
      return;
    }

    setSaving(true);
    try {
      await updateProduct(guid, {
        productCode: form.productCode.trim(),
        name: form.name.trim(),
        category: form.category.trim() || undefined,
        size: form.size.trim() || undefined,
        image: form.image.trim() || undefined,
        dpValue,
        bvValue,
        description: form.description.trim() || undefined,
        benefits: form.benefits
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        usage: form.usage
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      });
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-16">
        <Spinner className="w-6 h-6 text-brand-orange" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-brand-ink">Product not found</h2>
        <Link to="/admin/products" className="mt-4 inline-block text-sm font-bold text-brand-orange hover:underline">
          Back to All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-orange"
      >
        <Icon name="arrowRight" className="w-3.5 h-3.5 rotate-180" />
        Back to All Products
      </Link>
      <h2 className="mt-3 text-xl font-bold text-brand-ink">Edit Product</h2>
      <p className="mt-1 text-sm text-slate-500">Update this product's details below and save your changes.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-semibold text-brand-ink">Product Code</label>
          <input className={inputClass} value={form.productCode} onChange={update("productCode")} />
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Name</label>
          <input className={inputClass} value={form.name} onChange={update("name")} />
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Category</label>
          <input className={inputClass} value={form.category} onChange={update("category")} />
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">Size</label>
          <input className={inputClass} value={form.size} onChange={update("size")} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-brand-ink">Image Path</label>
          <input
            className={inputClass}
            value={form.image}
            onChange={update("image")}
            placeholder="/products/example.png"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">DP Value</label>
          <input
            type="number"
            inputMode="decimal"
            className={inputClass}
            value={form.dpValue}
            onChange={update("dpValue")}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-brand-ink">BV Value</label>
          <input
            type="number"
            inputMode="decimal"
            className={inputClass}
            value={form.bvValue}
            onChange={update("bvValue")}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-brand-ink">Description</label>
          <textarea rows={3} className={inputClass} value={form.description} onChange={update("description")} />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-brand-ink">Benefits</label>
          <p className="text-xs text-slate-400">One benefit per line.</p>
          <textarea rows={5} className={inputClass} value={form.benefits} onChange={update("benefits")} />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-brand-ink">How to Use</label>
          <p className="text-xs text-slate-400">One usage instruction per line.</p>
          <textarea rows={4} className={inputClass} value={form.usage} onChange={update("usage")} />
        </div>

        <div className="sm:col-span-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <>
                <Spinner className="w-4 h-4" />
                Saving...
              </>
            ) : (
              <>
                Save Changes
                <Icon name="arrowRight" className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
