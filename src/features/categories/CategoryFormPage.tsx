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
  order: z.coerce.number().int().min(0).default(0),
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

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      tags: [],
      status: "active" as const,
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
    const currentTags = form.getValues("tags") || [];
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto pb-6">
        {/* Page Header */}
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver a Categorías</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Editar Categoría" : "Nueva Categoría"}
          </h1>
          <p className="text-gray-500 mt-2">
            {isEditMode
              ? "Modifica los datos de la categoría existente"
              : "Completa la información para crear una nueva categoría"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Section: Información Básica */}
              <div className="space-y-4">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                  <p className="text-sm text-gray-500 mt-1">Datos principales de la categoría</p>
                </div>

                {/* Nombre */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">Nombre de la Categoría *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Electrónica, Hogar, Deportes..." 
                          disabled={loading}
                          className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
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
                      <FormLabel className="text-sm font-medium text-gray-900">Slug (URL amigable)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="electronica-y-tecnologia" 
                          disabled={loading}
                          className="h-11 bg-gray-50 border-gray-300 font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
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
                      <FormLabel className="text-sm font-medium text-gray-900">Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe brevemente esta categoría y qué tipo de productos o servicios incluye..."
                          disabled={loading}
                          rows={4}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section: SEO y Búsqueda */}
              <div className="space-y-4">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">SEO y Búsqueda</h3>
                  <p className="text-sm text-gray-500 mt-1">Mejora la visibilidad en búsquedas</p>
                </div>

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">Tags / Sinónimos</FormLabel>
                      <FormDescription className="text-xs text-gray-500 mb-3">
                        Palabras clave que ayudan a mejorar las búsquedas
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
                          className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddTag}
                          disabled={loading}
                          className="h-11 px-4 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                      {field.value && field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          {field.value.map((tag, index) => (
                            <Badge key={index} className="gap-2 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 border-0 shadow-sm">
                              <TagIcon className="w-3.5 h-3.5" />
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                disabled={loading}
                                className="ml-1 hover:text-red-200 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section: Apariencia */}
              <div className="space-y-4">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Apariencia</h3>
                  <p className="text-sm text-gray-500 mt-1">Personaliza la visualización de la categoría</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-900">Icono / Emoji</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="📱 o nombre de icono"
                            disabled={loading}
                            className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500">
                          Emoji o nombre del icono
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-900">Orden de Prioridad</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="0"
                            disabled={loading}
                            className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={typeof field.value === 'number' ? field.value : 0}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500">
                          Menor número = mayor prioridad
                        </FormDescription>
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
                      <FormLabel className="text-sm font-medium text-gray-900">URL de Imagen</FormLabel>
                      <FormControl>
                        <Input 
                          type="url"
                          placeholder="https://ejemplo.com/imagen.jpg"
                          disabled={loading}
                          className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Imagen representativa de la categoría
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section: Configuración */}
              <div className="space-y-4">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Configuración</h3>
                  <p className="text-sm text-gray-500 mt-1">Estado y disponibilidad</p>
                </div>

                {/* Estado */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-900">Estado de la Categoría *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                        <FormControl>
                          <SelectTrigger className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Selecciona un estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active" className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>Activo - Visible para usuarios</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="inactive" className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                              <span>Inactivo - Oculto para usuarios</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="h-11 px-6 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm flex-1 md:flex-none"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {isEditMode ? "Actualizar Categoría" : "Crear Categoría"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
