import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { categoryService } from "../../shared/services/categoryService";
import { useAuth } from "../../shared/hooks/useAuth";
import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import { Textarea } from "../../shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shared/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../shared/components/ui/form";
import { Badge } from "../../shared/components/ui/badge";
import { ArrowLeft, Save, X, Plus, Tag as TagIcon } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  slug: z.string().min(1, "El slug es requerido"),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["active", "inactive"]),
  icon: z.string().optional(),
  imageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  order: z.number().int().min(0).default(0),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export const CategoryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      tags: [],
      status: "active",
      icon: "",
      imageUrl: "",
      order: 0,
    },
  });

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
        form.reset({
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

  const handleAddTag = () => {
    const currentTags = form.getValues("tags");
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: CategoryFormData) => {
    setError("");
    setLoading(true);

    try {
      if (isEditMode && id) {
        await categoryService.update(id, data);
      } else {
        await categoryService.create({
          ...data,
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
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Nombre */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Categoría *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Electrónica, Hogar, Deportes..." 
                      disabled={loading}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Auto-generar slug
                        form.setValue("slug", categoryService.generateSlug(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL amigable)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="electronica-y-tecnologia" 
                      disabled={loading}
                      className="bg-muted"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Se genera automáticamente del nombre
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe brevemente esta categoría y qué tipo de productos o servicios incluye..."
                      disabled={loading}
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags / Sinónimos</FormLabel>
                  <FormDescription>
                    Ayudan a mejorar las búsquedas
                  </FormDescription>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: celulares, smartphones, móviles..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddTag}
                      disabled={loading}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {field.value.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="gap-2">
                          <TagIcon className="w-3 h-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            disabled={loading}
                            className="hover:text-destructive transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon y Order en Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icono / Emoji</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="📱 o nombre de icono"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden de Prioridad</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="0"
                        disabled={loading}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* URL de Imagen */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Imagen</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">✓ Activo - Visible para usuarios</SelectItem>
                      <SelectItem value="inactive">✗ Inactivo - Oculto para usuarios</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t-2 border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditMode ? "Actualizar Categoría" : "Crear Categoría"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
