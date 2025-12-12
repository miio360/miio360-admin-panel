# MIIO360 Admin Panel

Panel de administración para la gestión de categorías de MIIO360.

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

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
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

## 📁 Estructura del Proyecto

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
