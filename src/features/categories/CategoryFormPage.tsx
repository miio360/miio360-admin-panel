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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../shared/components/ui/card";
import { ArrowLeft, Save, X, Plus, Tag as TagIcon, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="pb-6">
        {/* Page Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-3 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Categorías
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Editar Categoría" : "Nueva Categoría"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isEditMode
              ? "Modifica los datos de la categoría existente"
              : "Completa la información para crear una nueva categoría"}
          </p>
        </div>

        {error && (
          <Card className="bg-red-50 border-red-200 mb-4">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 text-sm">Error</p>
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Section: Información Básica */}
              <div className="space-y-4">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Información Básica</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Datos principales de la categoría</p>
                </div>

                {/* Nombre */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Nombre de la Categoría *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Electrónica, Hogar, Deportes..." 
                          disabled={loading}
                          className="h-10"
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
                      <FormLabel className="text-sm font-medium">Slug (URL amigable)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="electronica-y-tecnologia" 
                          disabled={loading}
                          className="h-10 bg-muted/50 font-mono text-sm"
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
                      <FormLabel className="text-sm font-medium">Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe brevemente esta categoría y qué tipo de productos o servicios incluye..."
                          disabled={loading}
                          rows={3}
                          className="resize-none text-sm"
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
                  <h3 className="text-base font-semibold text-gray-900">SEO y Búsqueda</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Mejora la visibilidad en búsquedas</p>
                </div>

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Tags / Sinónimos</FormLabel>
                      <FormDescription className="text-xs">
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
                          className="h-10 text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddTag}
                          disabled={loading}
                          className="h-10 px-4 text-sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                      {field.value && field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                          {field.value.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="gap-1.5 px-2.5 py-1 text-xs">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                disabled={loading}
                                className="ml-0.5 hover:text-red-600 transition-colors"
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
              </div>

              {/* Section: Apariencia */}
              <div className="space-y-4">
                <div className="pb-3 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Apariencia</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Personaliza la visualización de la categoría</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Icono / Emoji</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="📱 o nombre de icono"
                            disabled={loading}
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
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
                        <FormLabel className="text-sm font-medium">Orden de Prioridad</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="0"
                            disabled={loading}
                            className="h-10"
                            value={typeof field.value === 'number' ? field.value : 0}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
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
                      <FormLabel className="text-sm font-medium">URL de Imagen</FormLabel>
                      <FormControl>
                        <Input 
                          type="url"
                          placeholder="https://ejemplo.com/imagen.jpg"
                          disabled={loading}
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
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
                  <h3 className="text-base font-semibold text-gray-900">Configuración</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Estado y disponibilidad</p>
                </div>

                {/* Estado */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Estado de la Categoría *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                        <FormControl>
                          <SelectTrigger className="h-10">
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
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="h-10 px-6 text-sm"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-10 px-6 text-sm bg-blue-500 hover:bg-blue-300 flex-1 sm:flex-none"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
