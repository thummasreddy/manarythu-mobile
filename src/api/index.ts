import { mocksEnabled, request } from "./client";
import { addresses, categories, farmers, orders, products } from "./mock";
import type { Address, Category, Farmer, Order, Product } from "./types";
const mock = async <T>(value: T) => { await new Promise((r) => setTimeout(r, 220)); return value; };
const query = (params: Record<string, unknown>) => { const values = Object.entries(params).filter(([, v]) => v !== undefined && v !== ""); return values.length ? `?${values.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&")}` : ""; };
export const api = {
  categories: () => mocksEnabled ? mock(categories) : request<Category[]>("/categories"),
  products: (params: { q?: string; category?: string; section?: string } = {}) => mocksEnabled ? mock(products.filter((p) => (!params.q || p.name.en.toLowerCase().includes(params.q.toLowerCase())) && (!params.category || p.categorySlug === params.category))) : request<Product[]>(`/products${query(params)}`),
  product: (slug: string) => mocksEnabled ? mock(products.find((p) => p.slug === slug)!) : request<Product>(`/products/${slug}`),
  farmers: () => mocksEnabled ? mock(farmers) : request<Farmer[]>("/farmers"),
  farmer: (slug: string) => mocksEnabled ? mock(farmers.find((f) => f.slug === slug)!) : request<Farmer>(`/farmers/${slug}`),
  checkLocation: (pincode: string) => mocksEnabled ? mock({ serviceable: pincode.length === 6, pincode, city: "Hyderabad", state: "Telangana" }) : request<{ serviceable: boolean; pincode: string; city?: string; state?: string }>(`/locations/check${query({ pincode })}`),
  requestOtp: (phone: string) => mocksEnabled ? mock({ requestId: "local-request" }) : request<{ requestId: string }>("/auth/otp/request", { method: "POST", body: { phone } }),
  verifyOtp: (phone: string, otp: string) => mocksEnabled ? mock({ accessToken: "mock-access", refreshToken: "mock-refresh" }) : request<{ accessToken: string; refreshToken: string }>("/auth/otp/verify", { method: "POST", body: { phone, otp } }),
  orders: () => mocksEnabled ? mock(orders) : request<Order[]>("/orders", { authenticated: true }),
  order: (id: string) => mocksEnabled ? mock(orders.find((o) => o.id === id)!) : request<Order>(`/orders/${id}`, { authenticated: true }),
  addresses: () => mocksEnabled ? mock(addresses) : request<Address[]>("/customers/me/addresses", { authenticated: true }),
  placeOrder: (body: unknown, key: string) => request<Order>("/orders", { method: "POST", body, authenticated: true, headers: { "Idempotency-Key": key } }),
};
export * from "./types";
