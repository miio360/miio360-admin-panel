import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Category } from "../types";
import { createBaseModel, updateModelTimestamp } from "../types/base";

const COLLECTION_NAME = "categories";

export const categoryService = {
  // Get all categories
  async getAll(): Promise<Category[]> {
    // Traer todas las categorías sin order para evitar índice compuesto
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const categories = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
      } as Category;
    });

    // Ordenar por 'order' en el cliente si existe
    return categories.sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });
  },

  // Search categories (including tags)
  async search(searchTerm: string): Promise<Category[]> {
    const categories = await this.getAll();
    const term = searchTerm.toLowerCase();
    
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.slug.toLowerCase().includes(term) ||
        category.description?.toLowerCase().includes(term)
    );
  },

  // Generate slug from name
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD") // Normaliza caracteres especiales
      .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
      .replace(/[^\w\s-]/g, "") // Elimina caracteres especiales
      .replace(/\s+/g, "-") // Reemplaza espacios con guiones
      .replace(/-+/g, "-") // Reemplaza múltiples guiones con uno solo
      .trim();
  },

  // Get category by ID
  async getById(id: string): Promise<Category | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
      } as Category;
    }
    return null;
  },

  // Create category
  async create(categoryData: Omit<Category, "id" | "createdAt" | "updatedAt" | "createdBy">, userId: string): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...categoryData,
      ...createBaseModel(userId),
    });
    return docRef.id;
  },

  // Update category
  async update(id: string, categoryData: Partial<Category>, userId?: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: any = { ...categoryData };
    if (userId) {
      Object.assign(updateData, updateModelTimestamp(userId));
    }
    await updateDoc(docRef, updateData);
  },

  // Delete category
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Get active categories
  async getActive(): Promise<Category[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("isActive", "==", true),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
      } as Category;
    });
  },

  // Reorder category and adjust others
  async reorderCategory(categoryId: string, newOrder: number, userId: string): Promise<void> {
    try {
      // Obtener todas las categorías
      const allCategories = await this.getAll();
      
      // Encontrar la categoría a reordenar
      const targetCategory = allCategories.find(cat => cat.id === categoryId);
      if (!targetCategory) {
        throw new Error('Categoría no encontrada');
      }

      const oldOrder = targetCategory.order ?? 999;
      
      // Si el orden no cambia, no hacer nada
      if (oldOrder === newOrder) return;

      // Preparar actualizaciones en lote
      const updates: Array<{ id: string; order: number }> = [];

      // Actualizar la categoría objetivo
      updates.push({ id: categoryId, order: newOrder });

      // Recalcular órdenes de las demás categorías
      allCategories.forEach(cat => {
        if (cat.id === categoryId) return; // Skip target
        
        const currentOrder = cat.order ?? 999;
        
        if (newOrder < oldOrder) {
          // Moviendo hacia arriba (incluye movimiento a 0): las que están entre [newOrder, oldOrder) se empujan hacia abajo
          if (currentOrder >= newOrder && currentOrder < oldOrder) {
            updates.push({ id: cat.id, order: currentOrder + 1 });
          }
        } else {
          // Moviendo hacia abajo: las que están entre (oldOrder, newOrder] se empujan hacia arriba
          if (currentOrder > oldOrder && currentOrder <= newOrder) {
            updates.push({ id: cat.id, order: currentOrder - 1 });
          }
        }
      });

      // Ejecutar todas las actualizaciones
      await Promise.all(
        updates.map(({ id, order }) => 
          this.update(id, { order }, userId)
        )
      );
    } catch (error) {
      console.error('Error reordering category:', error);
      throw new Error('No se pudo reordenar la categoría');
    }
  },

  // Fix duplicate orders
  async fixDuplicateOrders(userId: string): Promise<void> {
    try {
      const allCategories = await this.getAll();
      
      // Ordenar por order actual, luego por createdAt
      const sorted = allCategories.sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.createdAt.toMillis() - b.createdAt.toMillis();
      });

      // Reasignar órdenes consecutivos
      const updates = sorted.map((cat, index) => ({
        id: cat.id,
        order: index + 1,
      }));

      // Ejecutar actualizaciones
      await Promise.all(
        updates.map(({ id, order }) => 
          this.update(id, { order }, userId)
        )
      );
    } catch (error) {
      console.error('Error fixing duplicate orders:', error);
      throw new Error('No se pudieron corregir los órdenes duplicados');
    }
  },
};
