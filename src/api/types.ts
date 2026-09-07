export type Locale = "en" | "te";
export type LocalizedText = Record<Locale, string>;
export type Unit = "G" | "KG" | "ML" | "L" | "PIECE" | "BUNCH" | "DOZEN" | "BOX" | "BAG";
export type GrowingMethod = "ORGANIC" | "NATURAL" | "CONVENTIONAL";
export interface ApiResponse<T> { data: T; meta?: { page: number; size: number; totalElements: number; totalPages: number }; error?: { code: string; message: string; fieldErrors?: { field: string; message: string }[] } }
export interface Category { id: string; name: LocalizedText; slug: string; icon: string; imageUrl?: string; sortOrder: number }
export interface FarmerSummary { farmerId: string; farmerName: string; farmerSlug: string; farmerPhotoUrl?: string; experienceYears: number; farmId: string; farmName: string; farmSlug: string; village?: string; district: string; state: string }
export interface Variant { id: string; unit: Unit; unitSize: number; label: string; mrp: number; sellingPrice: number; savings: number; minOrderQty: number; maxOrderQty: number; availableQty: number; inStock: boolean }
export interface Product { id: string; name: LocalizedText; slug: string; description?: LocalizedText; categorySlug: string; imageUrl?: string; images?: string[]; growingMethod: GrowingMethod; organicCertified: boolean; harvestDate?: string; ratingAvg: number; ratingCount: number; farmer: FarmerSummary; defaultVariant: Variant; variants?: Variant[] }
export interface Farm { id: string; name: string; slug: string; village?: string; district: string; state: string; acreage?: number; farmingMethods?: string; photoUrl?: string }
export interface Farmer { id: string; displayName: string; slug: string; photoUrl?: string; story?: string; experienceYears: number; ratingAvg: number; ratingCount: number; primaryFarm?: Farm; farms?: Farm[] }
export interface CartItem { id: string; variantId: string; productId: string; productName: LocalizedText; productSlug: string; imageUrl?: string; variantLabel: string; farmerName: string; sellingPrice: number; qty: number; lineTotal: number }
export interface Cart { token: string; items: CartItem[]; totalItems: number; subtotal: number; totalSavings: number }
export interface Address { id: string; label: string; recipient: string; phone: string; line1: string; city: string; state: string; pincode: string; isDefault?: boolean }
export type OrderStatus = "ORDER_PLACED" | "PAYMENT_CONFIRMED" | "FARMER_ACCEPTED" | "HARVESTING_OR_PREPARING" | "READY_FOR_PICKUP" | "PICKED_UP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
export interface Order { id: string; number: string; createdAt: string; status: OrderStatus; total: number; items: CartItem[]; address: Address; timeline: { status: OrderStatus; at?: string; complete: boolean }[] }
