# Configuración de Firestore

## Índices Compuestos Requeridos

Para que las consultas funcionen correctamente, necesitas crear los siguientes índices compuestos en Firestore Console:

### Categories Collection

1. **Ordenamiento por order y createdAt**
   - Collection: `categories`
   - Fields to index:
     - `order` (Ascending)
     - `createdAt` (Descending)

### Cómo crear los índices:

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a Firestore Database > Indexes
4. Click en "Create Index"
5. Configura los campos como se indica arriba
6. Click en "Create"

**Nota:** También puedes esperar a que la app haga la query y Firebase te mostrará un error con un enlace directo para crear el índice automáticamente.

## Reglas de Seguridad

Actualiza las reglas de Firestore en Firebase Console:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Categories collection
    match /categories/{categoryId} {
      // Cualquiera autenticado puede leer
      allow read: if request.auth != null;
      
      // Solo admins pueden escribir
      allow create, update, delete: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
    }
  }
}
\`\`\`

## Estructura de Datos

### Category Document
\`\`\`json
{
  "name": "Electrónica",
  "slug": "electronica",
  "description": "Productos electrónicos y tecnología",
  "tags": ["tecnología", "gadgets", "dispositivos"],
  "status": "active",
  "parentId": null,
  "icon": "📱",
  "imageUrl": "https://example.com/image.jpg",
  "order": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "createdBy": "user_id"
}
\`\`\`

### User Document
\`\`\`json
{
  "email": "admin@miio360.com",
  "emailVerified": true,
  "phoneVerified": false,
  "activeRole": "admin",
  "roles": ["admin"],
  "status": "active",
  "profile": {
    "fullName": "Administrador",
    "phone": "+123456789"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
\`\`\`
