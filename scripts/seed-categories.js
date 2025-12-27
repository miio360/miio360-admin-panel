/**
 * Script para poblar la base de datos con categorías y subcategorías
 * Ejecutar: node scripts/seed-categories.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCWcx7byQrGtbTZCivpsS-iYfXPKq0OHOw",
  authDomain: "miio360.firebaseapp.com",
  projectId: "miio360",
  storageBucket: "miio360.firebasestorage.app",
  messagingSenderId: "256233957354",
  appId: "1:256233957354:web:4dbab69e37dcec78567493",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CREATED_BY = "admin-system";

// ====================================
// DEFINICIÓN DE CATEGORÍAS Y SUBCATEGORÍAS
// ====================================

const categoriesData = [
  {
    name: "Militar",
    slug: "militar",
    description: "Equipamiento y ropa táctica militar",
    icon: "shield-outline",
    order: 1,
    subcategories: [
      {
        name: "Ropa táctica",
        slug: "ropa-tactica",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "talla", label: "Talla", type: "text", required: true, order: 2 },
          { key: "color", label: "Color", type: "text", required: true, order: 3 },
          { key: "material", label: "Material", type: "text", required: false, order: 4 },
        ],
      },
      {
        name: "Equipamiento táctico",
        slug: "equipamiento-tactico",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "modelo", label: "Modelo", type: "text", required: true, order: 2 },
          { key: "material", label: "Material", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Botas tácticas",
        slug: "botas-tacticas",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "talla", label: "Talla", type: "number", required: true, order: 2 },
          { key: "color", label: "Color", type: "text", required: true, order: 3 },
        ],
      },
      {
        name: "Mochilas tácticas",
        slug: "mochilas-tacticas",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "capacidad", label: "Capacidad (L)", type: "number", required: true, unit: "L", order: 2 },
          { key: "color", label: "Color", type: "text", required: true, order: 3 },
        ],
      },
      {
        name: "Accesorios tácticos",
        slug: "accesorios-tacticos",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Outdoor y supervivencia",
        slug: "outdoor-supervivencia",
        features: [
          { key: "tipo", label: "Tipo de producto", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
    ],
  },
  {
    name: "Moda",
    slug: "moda",
    description: "Ropa y accesorios de moda",
    icon: "shirt-outline",
    order: 2,
    subcategories: [
      {
        name: "Hombre",
        slug: "hombre",
        features: [
          { key: "tipo", label: "Tipo de prenda", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "talla", label: "Talla", type: "text", required: true, order: 3 },
          { key: "color", label: "Color", type: "text", required: true, order: 4 },
        ],
      },
      {
        name: "Mujer",
        slug: "mujer",
        features: [
          { key: "tipo", label: "Tipo de prenda", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "talla", label: "Talla", type: "text", required: true, order: 3 },
          { key: "color", label: "Color", type: "text", required: true, order: 4 },
        ],
      },
      {
        name: "Niños",
        slug: "ninos",
        features: [
          { key: "tipo", label: "Tipo de prenda", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "talla", label: "Talla", type: "text", required: true, order: 3 },
          { key: "edad", label: "Edad recomendada", type: "text", required: false, order: 4 },
        ],
      },
      {
        name: "Accesorios",
        slug: "accesorios-moda",
        features: [
          { key: "tipo", label: "Tipo (gorra, cinturón, bufanda)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "material", label: "Material", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Relojes y joyería",
        slug: "relojes-joyeria",
        features: [
          { key: "tipo", label: "Tipo (reloj, collar, anillo)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "material", label: "Material", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Ropa interior / lencería",
        slug: "ropa-interior-lenceria",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "talla", label: "Talla", type: "text", required: true, order: 2 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Lentes de sol",
        slug: "lentes-sol",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "modelo", label: "Modelo", type: "text", required: false, order: 2 },
          { key: "proteccion_uv", label: "Protección UV", type: "text", required: false, order: 3 },
        ],
      },
    ],
  },
  {
    name: "Calzados",
    slug: "calzados",
    description: "Calzado para toda la familia",
    icon: "footsteps-outline",
    order: 3,
    subcategories: [
      {
        name: "Hombre",
        slug: "calzados-hombre",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "talla", label: "Talla", type: "number", required: true, order: 2 },
          { key: "tipo", label: "Tipo (zapato, sandalia, bota)", type: "text", required: true, order: 3 },
          { key: "color", label: "Color", type: "text", required: true, order: 4 },
        ],
      },
      {
        name: "Mujer",
        slug: "calzados-mujer",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "talla", label: "Talla", type: "number", required: true, order: 2 },
          { key: "tipo", label: "Tipo (zapato, sandalia, tacón)", type: "text", required: true, order: 3 },
          { key: "color", label: "Color", type: "text", required: true, order: 4 },
        ],
      },
      {
        name: "Niños",
        slug: "calzados-ninos",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "talla", label: "Talla", type: "number", required: true, order: 2 },
          { key: "edad", label: "Edad recomendada", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Deportivos",
        slug: "calzados-deportivos",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "talla", label: "Talla", type: "number", required: true, order: 2 },
          { key: "deporte", label: "Deporte", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Especiales",
        slug: "calzados-especiales",
        features: [
          { key: "tipo", label: "Tipo especial", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "talla", label: "Talla", type: "number", required: true, order: 3 },
        ],
      },
      {
        name: "Varios",
        slug: "calzados-varios",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "talla", label: "Talla", type: "number", required: false, order: 2 },
        ],
      },
    ],
  },
  {
    name: "Tecnología",
    slug: "tecnologia",
    description: "Dispositivos electrónicos y accesorios",
    icon: "laptop-outline",
    order: 4,
    subcategories: [
      {
        name: "Celulares",
        slug: "celulares",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "modelo", label: "Modelo", type: "text", required: true, order: 2 },
          { key: "ram", label: "RAM (GB)", type: "number", required: true, unit: "GB", order: 3 },
          { key: "almacenamiento", label: "Almacenamiento (GB)", type: "number", required: true, unit: "GB", order: 4 },
          { key: "estado", label: "Estado (Nuevo/Usado)", type: "text", required: true, order: 5 },
        ],
      },
      {
        name: "Accesorios para celulares",
        slug: "accesorios-celulares",
        features: [
          { key: "tipo", label: "Tipo (cargador, case, protector)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "compatible", label: "Compatible con", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Audio",
        slug: "audio",
        features: [
          { key: "tipo", label: "Tipo (audífonos, parlantes)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: true, order: 2 },
          { key: "conectividad", label: "Conectividad", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Computadoras y laptops",
        slug: "computadoras-laptops",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "modelo", label: "Modelo", type: "text", required: true, order: 2 },
          { key: "procesador", label: "Procesador", type: "text", required: true, order: 3 },
          { key: "ram", label: "RAM (GB)", type: "number", required: true, unit: "GB", order: 4 },
          { key: "almacenamiento", label: "Almacenamiento (GB)", type: "number", required: true, unit: "GB", order: 5 },
          { key: "pantalla", label: "Pantalla (pulgadas)", type: "number", required: false, unit: '"', order: 6 },
        ],
      },
      {
        name: "Accesorios para computadoras",
        slug: "accesorios-computadoras",
        features: [
          { key: "tipo", label: "Tipo (mouse, teclado, monitor)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Smartwatches y wearables",
        slug: "smartwatches-wearables",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "modelo", label: "Modelo", type: "text", required: true, order: 2 },
          { key: "funciones", label: "Funciones principales", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Cámaras y drones",
        slug: "camaras-drones",
        features: [
          { key: "tipo", label: "Tipo (cámara, drone)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: true, order: 2 },
          { key: "resolucion", label: "Resolución", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Consolas y videojuegos",
        slug: "consolas-videojuegos",
        features: [
          { key: "tipo", label: "Tipo (consola, juego, accesorio)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca/Consola", type: "text", required: true, order: 2 },
          { key: "modelo", label: "Modelo/Título", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Redes y routers",
        slug: "redes-routers",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "modelo", label: "Modelo", type: "text", required: false, order: 2 },
          { key: "velocidad", label: "Velocidad (Mbps)", type: "number", required: false, unit: "Mbps", order: 3 },
        ],
      },
      {
        name: "Cámaras de seguridad",
        slug: "camaras-seguridad",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "resolucion", label: "Resolución", type: "text", required: false, order: 2 },
          { key: "conectividad", label: "Conectividad", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Sensores",
        slug: "sensores",
        features: [
          { key: "tipo", label: "Tipo de sensor", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
    ],
  },
  {
    name: "Hogar",
    slug: "hogar",
    description: "Muebles, electrodomésticos y decoración",
    icon: "home-outline",
    order: 5,
    subcategories: [
      {
        name: "Decoración",
        slug: "decoracion",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "material", label: "Material", type: "text", required: false, order: 2 },
          { key: "dimensiones", label: "Dimensiones", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Muebles",
        slug: "muebles",
        features: [
          { key: "tipo", label: "Tipo de mueble", type: "text", required: true, order: 1 },
          { key: "material", label: "Material", type: "text", required: false, order: 2 },
          { key: "dimensiones", label: "Dimensiones (cm)", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Electrodomésticos grandes",
        slug: "electrodomesticos-grandes",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: true, order: 2 },
          { key: "modelo", label: "Modelo", type: "text", required: false, order: 3 },
          { key: "capacidad", label: "Capacidad", type: "text", required: false, order: 4 },
        ],
      },
      {
        name: "Electrodomésticos pequeños",
        slug: "electrodomesticos-pequenos",
        features: [
          { key: "tipo", label: "Tipo (licuadora, tostadora)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Organización y almacenamiento",
        slug: "organizacion-almacenamiento",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "material", label: "Material", type: "text", required: false, order: 2 },
          { key: "capacidad", label: "Capacidad", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Cocina y utensilios",
        slug: "cocina-utensilios",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "material", label: "Material", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Ropa de cama",
        slug: "ropa-cama",
        features: [
          { key: "tipo", label: "Tipo (sábanas, edredón)", type: "text", required: true, order: 1 },
          { key: "tamano", label: "Tamaño", type: "text", required: true, order: 2 },
          { key: "material", label: "Material", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Focos inteligentes",
        slug: "focos-inteligentes",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "tipo", label: "Tipo de conexión", type: "text", required: false, order: 2 },
          { key: "potencia", label: "Potencia (W)", type: "number", required: false, unit: "W", order: 3 },
        ],
      },
      {
        name: "Enchufes inteligentes",
        slug: "enchufes-inteligentes",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "voltaje", label: "Voltaje (V)", type: "number", required: false, unit: "V", order: 2 },
        ],
      },
      {
        name: "Domótica",
        slug: "domotica",
        features: [
          { key: "tipo", label: "Tipo de dispositivo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
    ],
  },
  {
    name: "Belleza y Cuidado Personal",
    slug: "belleza-cuidado-personal",
    description: "Productos de belleza y cuidado",
    icon: "heart-outline",
    order: 6,
    subcategories: [
      {
        name: "Maquillaje",
        slug: "maquillaje",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "tono", label: "Tono/Color", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Cuidado de la piel",
        slug: "cuidado-piel",
        features: [
          { key: "tipo", label: "Tipo (crema, sérum, limpiador)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "tipo_piel", label: "Tipo de piel", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Fragancias",
        slug: "fragancias",
        features: [
          { key: "tipo", label: "Tipo (perfume, colonia)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: true, order: 2 },
          { key: "volumen", label: "Volumen (ml)", type: "number", required: false, unit: "ml", order: 3 },
        ],
      },
      {
        name: "Cuidado del cabello",
        slug: "cuidado-cabello",
        features: [
          { key: "tipo", label: "Tipo (shampoo, acondicionador)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Barbería",
        slug: "barberia",
        features: [
          { key: "tipo", label: "Tipo de producto", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Uñas y accesorios",
        slug: "unas-accesorios",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Equipos de cuidado personal",
        slug: "equipos-cuidado-personal",
        features: [
          { key: "tipo", label: "Tipo (plancha, secador, depiladora)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: true, order: 2 },
        ],
      },
    ],
  },
  {
    name: "Deportes y Fitness",
    slug: "deportes-fitness",
    description: "Ropa y equipamiento deportivo",
    icon: "barbell-outline",
    order: 7,
    subcategories: [
      {
        name: "Ropa deportiva",
        slug: "ropa-deportiva",
        features: [
          { key: "tipo", label: "Tipo de prenda", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "talla", label: "Talla", type: "text", required: true, order: 3 },
          { key: "genero", label: "Género", type: "text", required: false, order: 4 },
        ],
      },
      {
        name: "Accesorios deportivos",
        slug: "accesorios-deportivos",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Equipamiento de gimnasio",
        slug: "equipamiento-gimnasio",
        features: [
          { key: "tipo", label: "Tipo de equipo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "peso", label: "Peso (kg)", type: "number", required: false, unit: "kg", order: 3 },
        ],
      },
      {
        name: "Suplementos",
        slug: "suplementos",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: true, order: 2 },
          { key: "sabor", label: "Sabor", type: "text", required: false, order: 3 },
          { key: "peso", label: "Peso (g)", type: "number", required: false, unit: "g", order: 4 },
        ],
      },
    ],
  },
  {
    name: "Bebés y Maternidad",
    slug: "bebes-maternidad",
    description: "Productos para bebés y maternidad",
    icon: "person-outline",
    order: 8,
    subcategories: [
      {
        name: "Ropa de bebé",
        slug: "ropa-bebe",
        features: [
          { key: "tipo", label: "Tipo de prenda", type: "text", required: true, order: 1 },
          { key: "talla", label: "Talla", type: "text", required: true, order: 2 },
          { key: "edad", label: "Edad recomendada", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Pañales",
        slug: "panales",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "talla", label: "Talla", type: "text", required: true, order: 2 },
          { key: "cantidad", label: "Cantidad", type: "number", required: false, order: 3 },
        ],
      },
      {
        name: "Cochecitos",
        slug: "cochecitos",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "tipo", label: "Tipo", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Alimentación",
        slug: "alimentacion-bebe",
        features: [
          { key: "tipo", label: "Tipo (mamila, plato, vaso)", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Juguetes para bebés",
        slug: "juguetes-bebes",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "edad", label: "Edad recomendada", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Accesorios de maternidad",
        slug: "accesorios-maternidad",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
    ],
  },
  {
    name: "Juguetes y Juegos",
    slug: "juguetes-juegos",
    description: "Juguetes para todas las edades",
    icon: "game-controller-outline",
    order: 9,
    subcategories: [
      {
        name: "Juegos educativos",
        slug: "juegos-educativos",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "edad", label: "Edad recomendada", type: "text", required: true, order: 2 },
        ],
      },
      {
        name: "Muñecas y figuras",
        slug: "munecas-figuras",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Construcción",
        slug: "construccion",
        features: [
          { key: "tipo", label: "Tipo (LEGO, bloques)", type: "text", required: true, order: 1 },
          { key: "piezas", label: "Número de piezas", type: "number", required: false, order: 2 },
          { key: "edad", label: "Edad recomendada", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Peluches",
        slug: "peluches",
        features: [
          { key: "tipo", label: "Tipo/Animal", type: "text", required: true, order: 1 },
          { key: "tamano", label: "Tamaño (cm)", type: "number", required: false, unit: "cm", order: 2 },
        ],
      },
      {
        name: "Juguetes electrónicos",
        slug: "juguetes-electronicos",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "edad", label: "Edad recomendada", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Juegos de mesa",
        slug: "juegos-mesa",
        features: [
          { key: "nombre", label: "Nombre del juego", type: "text", required: true, order: 1 },
          { key: "jugadores", label: "Número de jugadores", type: "text", required: false, order: 2 },
          { key: "edad", label: "Edad recomendada", type: "text", required: false, order: 3 },
        ],
      },
    ],
  },
  {
    name: "Oficina y Papelería",
    slug: "oficina-papeleria",
    description: "Artículos de oficina y papelería",
    icon: "briefcase-outline",
    order: 10,
    subcategories: [
      {
        name: "Cuadernos y agendas",
        slug: "cuadernos-agendas",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "hojas", label: "Número de hojas", type: "number", required: false, order: 2 },
        ],
      },
      {
        name: "Útiles escolares",
        slug: "utiles-escolares",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
        ],
      },
      {
        name: "Impresoras",
        slug: "impresoras",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "modelo", label: "Modelo", type: "text", required: true, order: 2 },
          { key: "tipo", label: "Tipo (inyección, láser)", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Cartuchos / tintas",
        slug: "cartuchos-tintas",
        features: [
          { key: "marca", label: "Marca", type: "text", required: true, order: 1 },
          { key: "modelo", label: "Modelo/Código", type: "text", required: true, order: 2 },
          { key: "color", label: "Color", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Escritorios y sillas",
        slug: "escritorios-sillas",
        features: [
          { key: "tipo", label: "Tipo (escritorio, silla)", type: "text", required: true, order: 1 },
          { key: "material", label: "Material", type: "text", required: false, order: 2 },
          { key: "dimensiones", label: "Dimensiones (cm)", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Organización de oficina",
        slug: "organizacion-oficina",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "material", label: "Material", type: "text", required: false, order: 2 },
        ],
      },
    ],
  },
  {
    name: "Equipaje",
    slug: "equipaje",
    description: "Maletas, mochilas y bolsos de viaje",
    icon: "bag-handle-outline",
    order: 11,
    subcategories: [
      {
        name: "Maletas",
        slug: "maletas",
        features: [
          { key: "marca", label: "Marca", type: "text", required: false, order: 1 },
          { key: "tamano", label: "Tamaño", type: "text", required: true, order: 2 },
          { key: "material", label: "Material", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Mochilas",
        slug: "mochilas-viaje",
        features: [
          { key: "marca", label: "Marca", type: "text", required: false, order: 1 },
          { key: "capacidad", label: "Capacidad (L)", type: "number", required: false, unit: "L", order: 2 },
          { key: "uso", label: "Uso (viaje, escolar)", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Bolsos",
        slug: "bolsos",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "marca", label: "Marca", type: "text", required: false, order: 2 },
          { key: "material", label: "Material", type: "text", required: false, order: 3 },
        ],
      },
      {
        name: "Organizadores",
        slug: "organizadores-viaje",
        features: [
          { key: "tipo", label: "Tipo", type: "text", required: true, order: 1 },
          { key: "material", label: "Material", type: "text", required: false, order: 2 },
        ],
      },
    ],
  },
  {
    name: "Personalizado",
    slug: "personalizado",
    description: "Productos personalizados con precios referenciales",
    icon: "create-outline",
    order: 12,
    subcategories: [
      {
        name: "Servicios personalizados",
        slug: "servicios-personalizados",
        features: [
          { key: "tipo_servicio", label: "Tipo de servicio", type: "text", required: true, order: 1 },
          { key: "descripcion", label: "Descripción detallada", type: "text", required: true, order: 2 },
          { key: "precio_referencial", label: "Precio referencial (Bs)", type: "number", required: false, unit: "Bs", order: 3 },
        ],
      },
      {
        name: "Otros servicios",
        slug: "otros-servicios",
        features: [
          { key: "nombre_servicio", label: "Nombre del servicio", type: "text", required: true, order: 1 },
          { key: "descripcion", label: "Descripción completa", type: "text", required: true, order: 2 },
          { key: "precio_referencial", label: "Precio referencial (Bs)", type: "number", required: false, unit: "Bs", order: 3 },
        ],
      },
    ],
  },
];

// ====================================
// FUNCIONES DE SEED
// ====================================

async function seedDatabase() {
  console.log("🌱 Iniciando seed de la base de datos...\n");

  try {
    for (const categoryData of categoriesData) {
      const { subcategories, ...categoryFields } = categoryData;

      // Crear categoría
      console.log(`📁 Creando categoría: ${categoryData.name}`);
      const categoryDoc = await addDoc(collection(db, "categories"), {
        ...categoryFields,
        isActive: true,
        createdBy: CREATED_BY,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(`   ✅ Categoría creada con ID: ${categoryDoc.id}`);

      // Crear subcategorías
      for (const subData of subcategories) {
        const { features, ...subFields } = subData;

        console.log(`   └─ Creando subcategoría: ${subData.name}`);
        await addDoc(collection(db, "subcategories"), {
          ...subFields,
          categoryId: categoryDoc.id,
          categoryName: categoryData.name,
          featureDefinitions: features,
          isActive: true,
          createdBy: CREATED_BY,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        console.log(`      ✅ Subcategoría creada`);
      }

      console.log();
    }

    console.log("✅ Seed completado exitosamente!");
    console.log(`📊 Total categorías: ${categoriesData.length}`);
    console.log(
      `📊 Total subcategorías: ${categoriesData.reduce((acc, cat) => acc + cat.subcategories.length, 0)}`
    );
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
  }

  process.exit(0);
}

// Ejecutar seed
seedDatabase();
