import { useEffect, useState } from "react";
import bundledProducts from "../data/products.json";
import { getAllProducts } from "../services/productService";

// Last list the API returned during this visit. Used as the starting point so a page you come back to paints
// immediately; it is always re-checked on mount, so a product the admin just added or edited shows up.
let lastKnown = null;

/** Maps an API product to the shape the public Home and Products pages render. */
function toPublicProduct(p) {
  return {
    id: p.productCode || p.productGuid,
    name: p.name ?? "",
    category: p.category ?? "",
    size: p.size ?? "",
    image: p.image ?? "",
    dpValue: p.dpValue,
    bvValue: p.bvValue,
    description: p.description ?? "",
    benefits: p.benefits ?? [],
    usage: p.usage ?? [],
  };
}

/**
 * The products shown on the public Home and Products pages. Starts from the products bundled with the website
 * (so the page is never empty while loading, or if the API is down) and then switches to the live list from the
 * API, so products added or edited in the admin panel appear without changing the website files.
 */
export function usePublicProducts() {
  const [products, setProducts] = useState(lastKnown ?? bundledProducts);

  useEffect(() => {
    let cancelled = false;
    getAllProducts()
      .then((list) => {
        lastKnown = list.map(toPublicProduct);
        if (!cancelled) setProducts(lastKnown);
      })
      .catch(() => {
        // Keep whatever is already showing (the bundled products, or the last list received).
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return products;
}
