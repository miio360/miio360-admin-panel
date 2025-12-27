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
import { Subcategory } from "../types";

const COLLECTION_NAME = "subcategories";

export const subcategoryService = {
  // Obtener todas las subcategorías
  async getAll(): Promise<Subcategory[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
      } as Subcategory;
    });
  },

  // Obtener subcategorías por categoría padre
  async getByCategoryId(categoryId: string): Promise<Subcategory[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("categoryId", "==", categoryId),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
      } as Subcategory;
    });
  },

  // Buscar subcategorías
  async search(searchTerm: string): Promise<Subcategory[]> {
    const subcategories = await this.getAll();
    const term = searchTerm.toLowerCase();
    
    return subcategories.filter(
      (subcategory) =>
        subcategory.name.toLowerCase().includes(term) ||
        subcategory.slug.toLowerCase().includes(term)
    );
  },

  // Generar slug desde nombre
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  },

  // Obtener subcategoría por ID
  async getById(id: string): Promise<Subcategory | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
      } as Subcategory;
    }
    return null;
  },

  // Crear subcategoría
  async create(subcategoryData: Omit<Subcategory, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...subcategoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Actualizar subcategoría
  async update(id: string, subcategoryData: Partial<Subcategory>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...subcategoryData,
      updatedAt: serverTimestamp(),
    });
  },

  // Eliminar subcategoría
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },
};
