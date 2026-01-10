/**
 * Tipos para categorías y subcategorías
 */
import { BaseModel } from './base';

/**
 * Tipos de características de producto
 */
export type FeatureType = 'text' | 'number';

/**
 * Definición de características para subcategorías
 */
export interface FeatureDefinition {
  key: string;
  label: string;
  type: FeatureType;
  required: boolean;
  order: number;
  placeholder?: string;
  unit?: string; // Para number (ej: kg, cm, etc.)
}

export interface Category extends BaseModel {
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl?: string;
  order: number;
  tags?: string[];
  isActive: boolean; // Alineado con Firebase
  productCount?: number; // Cantidad de productos en esta categoría
}

export interface Subcategory extends BaseModel {
  name: string;
  slug: string;
  description: string;
  categoryId: string; // Referencia a la categoría padre
  icon?: string;
  imageUrl?: string;
  order: number;
  tags?: string[];
  isActive: boolean; // Alineado con Firebase
  productCount?: number;
  featureDefinitions?: FeatureDefinition[]; // Definiciones de características
}

/**
 * DTO para crear una nueva categoría
 */
export interface CreateCategoryDTO {
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  order?: number;
  tags?: string[];
}

/**
 * DTO para actualizar una categoría
 */
export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
  isActive?: boolean;
}
