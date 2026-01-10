import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Subcategory } from "../types";
import { createBaseModel, updateModelTimestamp } from "../types/base";

const CATEGORY_COLLECTION = "categories";
const SUBCOLLECTION_NAME = "subcategories";

export const subcategoryService = {

  // Obtener todas las subcategorías de una categoría
  async getByCategoryId(categoryId: string): Promise<Subcategory[]> {
    const subcatRef = collection(db, CATEGORY_COLLECTION, categoryId, SUBCOLLECTION_NAME);
    const q = query(subcatRef, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<Subcategory, "id">;
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
      } satisfies Subcategory;
    });
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


  // Obtener subcategoría por ID (requiere categoryId y subcategoryId)
  async getById(categoryId: string, subcategoryId: string): Promise<Subcategory | null> {
    const docRef = doc(db, CATEGORY_COLLECTION, categoryId, SUBCOLLECTION_NAME, subcategoryId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<Subcategory, "id">;
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
      } satisfies Subcategory;
    }
    return null;
  },


  // Crear subcategoría (en subcolección de la categoría)
  async create(categoryId: string, subcategoryData: Omit<Subcategory, "id" | "createdAt" | "updatedAt" | "createdBy">, userId: string): Promise<string> {
    const subcatRef = collection(db, CATEGORY_COLLECTION, categoryId, SUBCOLLECTION_NAME);
    const docRef = await addDoc(subcatRef, {
      ...subcategoryData,
      ...createBaseModel(userId),
    });
    return docRef.id;
  },


  // Actualizar subcategoría (en subcolección de la categoría)
  async update(categoryId: string, subcategoryId: string, subcategoryData: Partial<Subcategory>): Promise<void> {
    const docRef = doc(db, CATEGORY_COLLECTION, categoryId, SUBCOLLECTION_NAME, subcategoryId);
    await updateDoc(docRef, {
      ...subcategoryData,
      ...updateModelTimestamp(),
    });
  },


  // Eliminar subcategoría (en subcolección de la categoría)
  async delete(categoryId: string, subcategoryId: string): Promise<void> {
    const docRef = doc(db, CATEGORY_COLLECTION, categoryId, SUBCOLLECTION_NAME, subcategoryId);
    await deleteDoc(docRef);
  },
};
