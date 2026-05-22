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
  purpose?: "SALE" | "RENT";
  category?: "RESIDENTIAL" | "COMMERCIAL" | "PLOT" | "PROJECT";
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
  useElasticsearch?: boolean;
}
