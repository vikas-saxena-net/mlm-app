import { useRef, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { uploadProductImage } from "../../services/productService";
import { resolveProductImageUrl } from "../../utils/productImage";
import Spinner from "../common/Spinner";
import Icon from "../Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { UpdateProductRequest } from "../../types/registration.types";

/** What the admin types into the form; numbers are kept as text until submit. */
export interface ProductFormValues {
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

const EMPTY_PRODUCT_FORM: ProductFormValues = {
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

interface ProductFormProps {
  initialValues?: ProductFormValues;
  submitLabel: string;
  /** Called with the validated payload; the form shows "Saving..." until it settles. Throw to keep the form open. */
  onSubmit: (payload: UpdateProductRequest) => Promise<void>;
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20";

const toLines = (text: string): string[] =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/** Shared by Add Product and Edit Product: same fields, same checks, same payload. */
export default function ProductForm({ initialValues = EMPTY_PRODUCT_FORM, submitLabel, onSubmit }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormValues>(initialValues);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Uploads right away and fills the image field with the stored path, so Save only has to send that path.
  const handleImageChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again
    if (!file) return;
    if (!/\.(jpe?g|png)$/i.test(file.name)) {
      toast.error("Choose a JPG, JPEG or PNG image.");
      return;
    }
    setUploading(true);
    try {
      const path = await uploadProductImage(file);
      setForm((f) => ({ ...f, image: path }));
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error((error as ApiErrorShape).message || "Could not upload the image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const update =
    (field: keyof ProductFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.productCode.trim() || !form.name.trim()) {
      toast.error("Product code and name are required.");
      return;
    }
    const dpValue = Number(form.dpValue);
    const bvValue = Number(form.bvValue);
    if (!form.dpValue.trim() || Number.isNaN(dpValue) || dpValue < 0) {
      toast.error("Enter a valid DP value.");
      return;
    }
    if (!form.bvValue.trim() || Number.isNaN(bvValue) || bvValue < 0) {
      toast.error("Enter a valid BV value.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        productCode: form.productCode.trim(),
        name: form.name.trim(),
        category: form.category.trim() || undefined,
        size: form.size.trim() || undefined,
        image: form.image.trim() || undefined,
        dpValue,
        bvValue,
        description: form.description.trim() || undefined,
        benefits: toLines(form.benefits),
        usage: toLines(form.usage),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
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
        <label className="text-sm font-semibold text-brand-ink">Product Image</label>
        <p className="text-xs text-slate-400">
          Upload a JPG, JPEG or PNG (up to 5 MB), or type the path of an image already on the website.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={handleImageChosen}
            className="hidden"
            aria-label="Upload product image"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Spinner className="w-3.5 h-3.5" />
                Uploading...
              </>
            ) : (
              <>
                <Icon name="gift" className="w-3.5 h-3.5" />
                {form.image ? "Replace image" : "Upload image"}
              </>
            )}
          </button>
          {form.image && (
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, image: "" }))}
              className="text-xs font-bold text-slate-500 hover:text-red-500"
            >
              Remove
            </button>
          )}
          {form.image && (
            <img
              src={resolveProductImageUrl(form.image)}
              alt="Product preview"
              className="h-16 w-16 rounded-lg border border-slate-100 bg-white object-contain"
            />
          )}
        </div>
        <input
          className={inputClass}
          value={form.image}
          onChange={update("image")}
          placeholder="/products/example.png or an uploaded /uploads/... path"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-brand-ink">DP Value (price)</label>
        <input
          type="number"
          inputMode="decimal"
          min="0"
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
          min="0"
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
              {submitLabel}
              <Icon name="arrowRight" className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
