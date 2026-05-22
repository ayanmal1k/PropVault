export enum UserRole {
  USER = "USER",
  AGENT = "AGENT",
  AGENCY_ADMIN = "AGENCY_ADMIN",
  ADMIN = "ADMIN",
}

export enum ListingPurpose {
  SALE = "SALE",
  RENT = "RENT",
}

export enum PropertyCategory {
  RESIDENTIAL = "RESIDENTIAL",
  COMMERCIAL = "COMMERCIAL",
  PLOT = "PLOT",
  PROJECT = "PROJECT",
}

export enum PropertyStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
  SOLD = "SOLD",
  RENTED = "RENTED",
  EXPIRED = "EXPIRED",
}

export enum VerificationStatus {
  UNVERIFIED = "UNVERIFIED",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PropertySearchFilters {
  q?: string;
  purpose?: ListingPurpose;
  category?: PropertyCategory;
  cityId?: string;
  areaId?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyTypeId?: string;
  featured?: boolean;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  polygon?: Array<{ lat: number; lng: number }>;
  sort?: "price_asc" | "price_desc" | "newest" | "area_asc" | "area_desc" | "featured";
  page?: number;
  limit?: number;
}

export const SUPPORTED_LOCALES = ["en", "ur", "ar"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
