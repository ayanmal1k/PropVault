import { config } from "../config";

export interface ESPropertyDoc {
  id: string;
  title: string;
  slug: string;
  description: string;
  purpose: string;
  category: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSize: number;
  areaUnit: string;
  cityId: string;
  cityName: string;
  areaId?: string;
  areaName?: string;
  propertyTypeId: string;
  propertyTypeName: string;
  featured: boolean;
  trending: boolean;
  latitude: number;
  longitude: number;
  location: { lat: number; lon: number };
  images: string[];
  createdAt: string;
}

export function getElasticsearch(): null {
  if (!config.elasticsearch.node) return null;
  return null;
}

export async function ensurePropertyIndex(): Promise<void> {
  /* Elasticsearch optional — install @elastic/elasticsearch to enable */
}

export async function indexProperty(_doc: ESPropertyDoc): Promise<void> {}

export async function deletePropertyFromIndex(_id: string): Promise<void> {}
