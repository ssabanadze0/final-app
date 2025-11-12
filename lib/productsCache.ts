// lib/productsCache.ts
import type { Product } from "../components/productcards";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  const data: Product[] = await res.json();
  return data;
}
