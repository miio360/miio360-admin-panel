import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryService } from "../../shared/services/categoryService";
import { useAuth } from "../../shared/hooks/useAuth";

export const CategoryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    tags: [] as string[],
    status: "active" as "active" | "inactive",
    icon: "",
    imageUrl: "",
    order: 0,
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode && id) {
      loadCategory(id);
    }
  }, [id, isEditMode]);

  const loadCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      const category = await categoryService.getById(categoryId);
      if (category) {
        setFormData({
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          tags: category.tags || [],
          status: category.status,
          icon: category.icon || "",
          imageUrl: category.imageUrl || "",
          order: category.order || 0,
        });
      }
    } catch (err: any) {
      setError("Error al cargar la categoría");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Auto-generar slug cuando cambia el nombre
    if (name === "name") {
      setFormData({ 
        ...formData, 
        name: value,
        slug: categoryService.generateSlug(value)
      });
    } else if (name === "order") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("El nombre es requerido");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode && id) {
        await categoryService.update(id, formData);
      } else {
        await categoryService.create({
          ...formData,
          createdBy: user?.id || "",
        });
      }
      navigate("/categories");
    } catch (err: any) {
      console.error("Form error:", err);
      setError(err.message || "Error al guardar la categoría");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/categories");
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditMode ? "Editar Categoría" : "Nueva Categoría"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode
                ? "Modifica los datos de la categoría"
                : "Completa los datos para crear una nueva categoría"}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive border-2 border-destructive/30 rounded-xl p-4 mb-6 text-sm font-medium flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="bg-card border-2 border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-muted/30 px-8 py-6 border-b-2 border-border">
          <h2 className="text-xl font-bold text-foreground">Información de la Categoría</h2>
          <p className="text-sm text-muted-foreground mt-1">Completa todos los campos requeridos</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-3 text-foreground">
              Nombre de la Categoría <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                required
                disabled={loading}
                placeholder="Ej: Electrónica, Hogar, Deportes..."
              />
            </div>
          </div>

          {/* Slug (auto-generado) */}
          <div>
            <label htmlFor="slug" className="block text-sm font-semibold mb-3 text-foreground">
              Slug (URL amigable) <span className="text-muted-foreground text-xs">- Se genera automáticamente</span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-border rounded-xl bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              disabled={loading}
              placeholder="electronica-y-tecnologia"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold mb-3 text-foreground">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              disabled={loading}
              placeholder="Describe brevemente esta categoría y qué tipo de productos o servicios incluye..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-foreground">
              Tags / Sinónimos
              <span className="text-muted-foreground text-xs font-normal ml-2">- Para mejorar búsquedas</span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-3 border-2 border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                disabled={loading}
                placeholder="Ej: celulares, smartphones, móviles..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={loading}
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-secondary/90 transition-all"
              >
                Agregar
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={loading}
                      className="hover:text-destructive transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Icon and Image in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="icon" className="block text-sm font-semibold mb-3 text-foreground">
                Icono / Emoji
              </label>
              <input
                id="icon"
                name="icon"
                type="text"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                disabled={loading}
                placeholder="📱 o nombre de icono"
              />
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-semibold mb-3 text-foreground">
                Orden de Prioridad
              </label>
              <input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                disabled={loading}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-semibold mb-3 text-foreground">
              URL de Imagen
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              disabled={loading}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold mb-3 text-foreground">
              Estado <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer"
                required
                disabled={loading}
              >
                <option value="active">✓ Activo - Visible para usuarios</option>
                <option value="inactive">✗ Inactivo - Oculto para usuarios</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t-2 border-border">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-muted text-foreground py-3 rounded-xl font-semibold hover:bg-muted/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEditMode ? "Actualizar Categoría" : "Crear Categoría"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
