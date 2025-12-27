/**
 * Colores MIIO360 - Paleta oficial de la marca
 * 
 * Este archivo centraliza todos los colores utilizados en el proyecto.
 * SIEMPRE usa las clases de Tailwind en lugar de valores hexadecimales directos.
 */

export const MIIO360_COLORS = {
  // Colores principales
  primary: '#FECD1B',        // Amarillo MIIO360 - Color principal de la marca
  background: '#FDF3DA',     // Crema suave - Fondo general
  foreground: '#011611',     // Verde oscuro - Texto principal
  
  // Colores secundarios
  secondary: '#10b981',      // Verde esmeralda - Color complementario
  
  // Colores de estado
  success: '#22c55e',        // Verde - Éxito
  warning: '#f59e0b',        // Naranja - Advertencia
  error: '#ef4444',          // Rojo - Error
  info: '#3b82f6',           // Azul - Información
} as const;

/**
 * Clases de Tailwind CSS recomendadas
 * 
 * Usa estas clases en tus componentes en lugar de valores hexadecimales:
 * 
 * FONDOS:
 * - bg-primary          → Amarillo MIIO360 (#FECD1B)
 * - bg-background       → Crema suave (#FDF3DA)
 * - bg-foreground       → Verde oscuro (#011611)
 * - bg-secondary        → Verde esmeralda
 * 
 * TEXTO:
 * - text-primary        → Amarillo MIIO360
 * - text-foreground     → Verde oscuro (texto principal)
 * - text-background     → Crema suave
 * - text-secondary      → Verde esmeralda
 * 
 * BORDES:
 * - border-primary      → Amarillo MIIO360
 * - border-foreground   → Verde oscuro
 * - border-gray-200     → Gris claro para bordes sutiles
 * 
 * OPACIDADES (útiles para fondos sutiles):
 * - bg-primary/5        → Amarillo 5% opacidad
 * - bg-primary/10       → Amarillo 10% opacidad
 * - bg-primary/20       → Amarillo 20% opacidad
 * - bg-primary/30       → Amarillo 30% opacidad
 * 
 * GRADIENTES:
 * - from-primary to-primary/80
 * - from-secondary to-secondary/70
 * 
 * EJEMPLOS DE USO:
 * 
 * ```tsx
 * // ✅ CORRECTO - Usando clases de Tailwind
 * <Button className="bg-primary text-foreground hover:bg-primary/90">
 *   Botón primario
 * </Button>
 * 
 * <div className="bg-primary/10 border border-primary/30">
 *   Contenedor con fondo amarillo sutil
 * </div>
 * 
 * // ❌ INCORRECTO - Hardcodeando colores
 * <Button className="bg-[#FECD1B] text-[#011611]">
 *   No hacer esto
 * </Button>
 * ```
 */

export type ColorKey = keyof typeof MIIO360_COLORS;
