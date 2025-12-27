# Scripts de Base de Datos

## 📦 Seed de Categorías y Subcategorías

Script para poblar la base de datos con todas las categorías y subcategorías predefinidas de MIIO360.

### Requisitos previos

1. Asegúrate de tener las variables de entorno configuradas en `.env`:
   ```env
   VITE_FIREBASE_API_KEY=tu-api-key
   VITE_FIREBASE_AUTH_DOMAIN=tu-auth-domain
   VITE_FIREBASE_PROJECT_ID=tu-project-id
   VITE_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
   VITE_FIREBASE_APP_ID=tu-app-id
   ```

2. Instala las dependencias si aún no lo has hecho:
   ```bash
   npm install
   ```

### Cómo ejecutar

```bash
node scripts/seed-categories.js
```

### ¿Qué hace el script?

1. Crea **11 categorías principales**:
   - Militar
   - Moda
   - Calzados
   - Tecnología
   - Hogar
   - Belleza y Cuidado Personal
   - Deportes y Fitness
   - Bebés y Maternidad
   - Juguetes y Juegos
   - Oficina y Papelería
   - Equipaje

2. Para cada categoría, crea sus **subcategorías** con:
   - Nombre y slug
   - Campos personalizados (`featureDefinitions`)
   - Estado activo
   - Relación con la categoría padre

3. Los **campos personalizados** definen qué información debe proporcionar un vendedor al crear un producto. Por ejemplo:
   
   **Subcategoría "Celulares":**
   - Marca (texto, requerido)
   - Modelo (texto, requerido)
   - RAM en GB (número, requerido)
   - Almacenamiento en GB (número, requerido)
   - Estado: Nuevo/Usado (texto, requerido)

### Estructura de datos

#### Categoría
```javascript
{
  name: "Tecnología",
  slug: "tecnologia",
  description: "Dispositivos electrónicos y accesorios",
  icon: "laptop-outline",
  order: 4,
  isActive: true,
  createdBy: "admin-system",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Subcategoría
```javascript
{
  name: "Celulares",
  slug: "celulares",
  categoryId: "abc123",
  categoryName: "Tecnología",
  isActive: true,
  featureDefinitions: [
    {
      key: "marca",
      label: "Marca",
      type: "text",
      required: true,
      order: 1
    },
    {
      key: "ram",
      label: "RAM (GB)",
      type: "number",
      required: true,
      unit: "GB",
      order: 3
    }
  ],
  createdBy: "admin-system",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Tipos de campos disponibles

- **`text`**: Campos de texto (marca, modelo, color, etc.)
- **`number`**: Campos numéricos (RAM, peso, dimensiones, etc.)

Cada campo puede tener:
- `key`: Identificador único (ej: "marca", "ram")
- `label`: Etiqueta visible (ej: "Marca", "RAM (GB)")
- `type`: "text" o "number"
- `required`: true/false
- `unit`: Unidad de medida (opcional, ej: "GB", "kg", "cm")
- `placeholder`: Texto de ayuda (opcional)
- `order`: Orden de visualización

### Notas importantes

⚠️ **Este script debe ejecutarse solo UNA vez** para crear la estructura inicial.

Si necesitas ejecutarlo de nuevo:
1. Elimina manualmente las colecciones `categories` y `subcategories` desde Firebase Console
2. Vuelve a ejecutar el script

### Verificación

Después de ejecutar el script, verifica en Firebase Console:

1. Ve a **Firestore Database**
2. Revisa la colección `categories` (debe tener 11 documentos)
3. Revisa la colección `subcategories` (debe tener ~70 documentos)
4. Verifica que cada subcategoría tenga su array `featureDefinitions`
