import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProduct } from "../../services/productService";
import ProductForm from "../../components/admin/ProductForm";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { UpdateProductRequest } from "../../types/registration.types";

export default function AddProduct() {
  const navigate = useNavigate();

  const handleSubmit = async (payload: UpdateProductRequest) => {
    try {
      await createProduct(payload);
      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Failed to add product. Please try again.");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-orange"
      >
        <Icon name="arrowRight" className="w-3.5 h-3.5 rotate-180" />
        Back to All Products
      </Link>
      <h2 className="mt-3 text-xl font-bold text-brand-ink">Add Product</h2>
      <p className="mt-1 text-sm text-slate-500">
        Enter the new product's details. Members pay the DP value; the BV value counts towards their status. The
        product code must be unique.
      </p>

      <ProductForm submitLabel="Add Product" onSubmit={handleSubmit} />
    </div>
  );
}
