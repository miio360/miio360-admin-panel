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
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Category } from "../types";

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
  async create(categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Update category
  async update(id: string, categoryData: Partial<Category>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...categoryData,
      updatedAt: serverTimestamp(),
    });
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
};
