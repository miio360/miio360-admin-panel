# Centralización de Colores - Pendientes

## ✅ Completado (26 dic 2024)

### Archivos corregidos:
- ✅ `src/features/categories/categories-page.tsx` - Botón "Nueva Categoría" ahora usa `bg-primary` y `text-foreground`
- ✅ `src/shared/components/layout/Sidebar.tsx` - Colores de navegación ahora usan variables de Tailwind

---

## ❌ Pendiente: Colores hardcodeados detectados

### Archivos con colores hardcodeados (>50 instancias encontradas):

#### 🚨 Alta prioridad (UI crítica):

1. **`src/features/categories/components/category-table-expandable.tsx`**
   - `bg-gray-50`, `text-gray-600`, `text-gray-500`, etc.
   - Estados: `text-green-700 bg-green-50` → usar `text-secondary bg-secondary/10`
   - Estados inactivos: `text-gray-600 bg-gray-100` → usar `text-muted bg-muted`

2. **`src/features/categories/components/category-table.tsx`**
   - `bg-gray-100`, `text-gray-600`, etc.
   - Estado activo: `bg-green-100 text-green-700` → usar `bg-secondary/10 text-secondary`
   - Estado inactivo: `bg-gray-100 text-gray-600` → usar `bg-muted text-muted-foreground`

3. **`src/features/categories/components/category-stats.tsx`**
   - `text-green-700`, `text-blue-700` → usar `text-secondary`, `text-accent`

4. **`src/features/categories/components/category-search-bar.tsx`**
   - `text-gray-400`, `border-gray-200` → usar `text-muted-foreground`, `border-border`

5. **`src/shared/components/layout/Header.tsx`**
   - `bg-gray-50`, `text-gray-600`, `border-gray-200` → usar variables de Tailwind

6. **`src/shared/components/AdminLayout.tsx`**
   - `bg-gray-50` → usar `bg-background`

#### ⚠️ Media prioridad:

7. **`src/features/dashboard/components/dashboard-*.tsx`** (4 archivos)
   - `bg-blue-500`, `bg-green-500` → definir colores en theme
   - `bg-yellow-100 text-yellow-700` (estados) → usar variables

8. **`src/features/auth/login-page.tsx`**
   - `bg-blue-500/10`, `bg-purple-500/10`, `bg-red-500/10` → usar theme

---

## 📋 Plan de acción recomendado

### Paso 1: Extender el theme en `tailwind.config.js` (si es necesario)

```javascript
colors: {
  // ... colores existentes
  success: {
    DEFAULT: "hsl(var(--color-secondary))", // verde para estados activos
    foreground: "hsl(var(--color-secondary-foreground))",
  },
  info: {
    DEFAULT: "hsl(var(--color-accent))", // amarillo para info
    foreground: "hsl(var(--color-accent-foreground))",
  },
}
```

### Paso 2: Mapeo de colores hardcodeados a variables

| Color hardcodeado | Variable Tailwind correcta |
|-------------------|---------------------------|
| `bg-gray-50`, `bg-gray-100` | `bg-muted` |
| `text-gray-400`, `text-gray-500` | `text-muted-foreground` |
| `text-gray-600`, `text-gray-700` | `text-foreground/70` o `text-foreground` |
| `text-gray-900` | `text-foreground` |
| `border-gray-200`, `border-gray-800` | `border-border` |
| `bg-green-50`, `text-green-700` | `bg-secondary/10 text-secondary` |
| `bg-green-100`, `text-green-700` | `bg-secondary/20 text-secondary` |
| `bg-red-50`, `text-red-600` | `bg-destructive/10 text-destructive` |
| `bg-blue-50`, `text-blue-700` | `bg-accent/10 text-accent` |

### Paso 3: Orden de corrección

1. Corregir components de categorías (ya que es el feature principal)
2. Corregir layout (Header, AdminLayout)
3. Corregir dashboard components
4. Corregir login-page

### Paso 4: Validación

Después de cada cambio:
- ✅ Ejecutar `npm run lint`
- ✅ Verificar visualmente en el navegador
- ✅ Comprobar modo oscuro (si aplica)

---

## 🎨 Recordatorio: Paleta MIIO360

```css
--primary: #FECD1B        /* Amarillo MIIO360 */
--background: #FDF3DA     /* Crema suave */
--foreground: #011611     /* Verde oscuro / texto */
--secondary: Verde esmeralda (definido en theme)
```

**Uso en Tailwind:**
- `bg-primary` → Amarillo MIIO360
- `bg-background` → Fondo crema/blanco
- `text-foreground` → Texto principal (verde oscuro)
- `bg-muted` → Fondos secundarios (gris claro)
- `text-muted-foreground` → Textos secundarios (gris)
- `border-border` → Bordes (gris claro)

---

## 📝 Notas

- **NO usar colores hardcodeados**: `bg-[#FECD1B]`, `text-[#78350F]`, etc.
- **NO usar clases numéricas de color**: `bg-gray-100`, `text-blue-500`, etc.
- **SÍ usar variables de theme**: `bg-primary`, `text-foreground`, `bg-muted`, etc.
- **Excepciones permitidas**: Solo en casos muy específicos documentados

---

**Fecha de creación:** 26 de diciembre de 2024  
**Estado:** 🚧 En progreso (2/50+ archivos corregidos)
