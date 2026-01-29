// Product types for ecommerce platform
import { Timestamp } from 'firebase/firestore';
import {
  BaseModel,
  CustomLocation,
  FileUploaded,
  Rating,
  VisibilityModel,
} from './base';
import { SellerSummary } from './summaries';

export interface Stock {
  total: number;
  available: number;
  reserved: number;
}

export interface ProductFeature {
  [key: string]: string | number; 
}

export interface Product extends BaseModel, VisibilityModel {
  // Información básica
  name: string;
  description: string;

  price: number; // Precio de venta actual (con descuento aplicado si existe)
  originalPrice: number; // Precio original sin descuento
  discount: number; // Porcentaje de descuento (0-100)

  // Vendedor
  seller: SellerSummary;

  // Categorización (estructura anidada)
  category: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };

  // Multimedia
  images: FileUploaded[];

  // Inventario
  stock: Stock;
  sku?: string;

  // Calificaciones y reseñas
  rating: Rating;

  // Etiquetas y características
  tags: string[];
  features: ProductFeature;

  // Búsqueda (keywords del título para búsqueda eficiente)
  keywords: Record<string, boolean>;

  // Estado
  status: ProductStatus;

  // Métricas
  views: number;
  sold: number;
  favorites: number;

  // Ubicación del producto (opcional, para productos locales)
  location?: CustomLocation;

  // Destacado/promocionado
  isFeatured: boolean;
  isPromoted: boolean;
  promotedUntil?: Timestamp;
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DELETED = 'deleted',
  PENDING = 'pending',
}

// Favorite product (para Firebase)
export interface FavoriteProduct extends BaseModel {
  productId: string;
  userId: string;
}
/**
 * DTO para crear un nuevo producto
 */
export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number; // Porcentaje de descuento (0-100)
  category: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
  images: FileUploaded[];
  stock: number;
  sku?: string;
  tags: string[];
  features?: Record<string, string>;
  location?: CustomLocation;
}

/**
 * DTO para actualizar un producto
 */
export interface UpdateProductDTO extends Partial<Omit<CreateProductDTO, 'stock'>> {
  stock?: number | Stock;
  isVisible?: boolean;
  isFeatured?: boolean;
  status?: ProductStatus;
}

// Serialized version for Redux
export interface SerializedFavoriteProduct extends Omit<FavoriteProduct, 'addedAt'> {
  addedAt: string;
}
