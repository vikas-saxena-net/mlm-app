import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllProducts, updateProduct } from "../../services/productService";
import ProductForm, { type ProductFormValues } from "../../components/admin/ProductForm";
import Spinner from "../../components/common/Spinner";
import Icon from "../../components/Icon";
import type { ApiErrorShape } from "../../services/api/httpClient";
import type { UpdateProductRequest } from "../../types/registration.types";

export default function EditProduct() {
  const { guid } = useParams<{ guid: string }>();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<ProductFormValues | null>(null);
  const [loading, setLoading] = useState(true);
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
        setInitialValues({
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

  const handleSubmit = async (payload: UpdateProductRequest) => {
    if (!guid) return;
    try {
      await updateProduct(guid, payload);
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      const apiError = error as ApiErrorShape;
      toast.error(apiError.message || "Failed to update product. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-16">
        <Spinner className="w-6 h-6 text-brand-orange" />
      </div>
    );
  }

  if (notFound || !initialValues) {
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

      <ProductForm initialValues={initialValues} submitLabel="Save Changes" onSubmit={handleSubmit} />
    </div>
  );
}
