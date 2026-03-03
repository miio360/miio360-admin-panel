# MIIO360 Admin Panel
asd
Panel de administración para la gestión de categorías de MIIO360..

## 🚀 Características

- ✅ Autenticación con Firebase
- ✅ Gestión completa de categorías (CRUD)
- ✅ Búsqueda de categorías
- ✅ Protección de rutas para usuarios admin
- ✅ TypeScript + React + Vite
- ✅ Tailwind CSS + shadcn/ui
- ✅ CI/CD con GitHub Actions

## 🎨 Tecnologías

- React 19
- TypeScript
- Vite
- Firebase (Auth + Firestore)
- React Router DOM
- Tailwind CSS
- shadcn/ui

## 📦 Instalación

\`\`\`bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita el archivo .env con tus credenciales de Firebase

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
\`\`\`

## ⚙️ Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita Authentication (Email/Password)
3. Crea una base de datos Firestore
4. Copia las credenciales a tu archivo \`.env\`:

\`\`\`env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
# ... etc
\`\`\`

## 🔐 Credenciales de Acceso

### Para crear un nuevo usuario Admin:

1. Ve a \`http://localhost:5173/signup\` en el navegador
2. Registra un nuevo usuario:

\`\`\`
Email: admin@miio360.com
Password: Admin123!
Nombre Completo: Gabriela Garcia Villalobos
Teléfono: +59176435692
\`\`\`

3. El usuario se creará automáticamente con rol de \`admin\`

**Nota:** Solo los usuarios con rol \`admin\` pueden acceder al panel.

## � Configuración de Firestore

Después de crear tu proyecto en Firebase, revisa el archivo \`FIRESTORE_SETUP.md\` para:
- Crear los índices compuestos necesarios
- Configurar las reglas de seguridad
- Ver ejemplos de la estructura de datos

## �📁 Estructura del Proyecto

\`\`\`
src/
├── features/           # Módulos de funcionalidades
│   ├── auth/          # Login y Signup
│   └── categories/    # Gestión de categorías
├── shared/            # Código compartido
│   ├── components/    # Componentes reutilizables
│   ├── hooks/         # Custom hooks
│   ├── services/      # Servicios de Firebase
│   ├── types/         # TypeScript types
│   └── lib/           # Utilidades
└── App.tsx            # Configuración de rutas
\`\`\`

## 🎯 Funcionalidades

### Categorías Mejoradas
- **Slug automático**: URLs amigables generadas automáticamente
- **Tags/Sinónimos**: Mejora las búsquedas con palabras clave
- **Orden de prioridad**: Controla qué categorías aparecen primero
- **Iconos y emojis**: Representación visual de cada categoría
- **Imágenes**: URL de imagen para cada categoría
- **Búsqueda avanzada**: Busca por nombre, slug, descripción o tags

### Autenticación
- Sign up con validación
- Login con email/password
- Protección de rutas por rol
- Logout

### Gestión de Categorías
- Listar todas las categorías
- Buscar categorías por nombre/descripción
- Crear nueva categoría
- Editar categoría existente
- Eliminar categoría
- Estados: Activo/Inactivo

## 🎨 Paleta de Colores

- Primary: #FECD1B (Amarillo MIIO360)
- Background: #FDF3DA (Crema suave)
- Dark: #011611 (Verde oscuro)
