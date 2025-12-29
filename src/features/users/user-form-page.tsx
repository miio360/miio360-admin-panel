import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserForm } from './hooks/useUserForm';
import { userFormSchema, UserFormData } from './user-form-schema';
import { InputGlobal } from '@/shared/components/ui/input-global';
import { Button } from '@/shared/components/ui/button';
import { SelectGlobal } from '@/shared/components/ui/select-global';
import { UserRole, UserStatus } from '@/shared/types';
import { Card } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Form } from '@/shared/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import { userService } from '@/shared/services/userService';

export default function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const form = useUserForm(id);
  const { formState: { isSubmitting, errors } } = form;

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing && id) {
        // TODO: Implementar update
        alert('Actualización de usuario aún no implementada');
      } else {
        if (!data.password) {
          alert('La contraseña es obligatoria');
          return;
        }
        await userService.createUser({
          email: data.email,
          password: data.password!,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          activeRole: data.activeRole,
          status: data.status,
          vehicleType: data.activeRole === UserRole.COURIER ? data.vehicleType : undefined,
        });
        alert('Usuario creado correctamente');
      }
      navigate('/users');
    } catch (error: any) {
      alert(error?.message || 'Error al guardar el usuario');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Botón Volver */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/users')}
            className="hover:bg-muted text-foreground font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Usuarios
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8 bg-card border border-border rounded-lg p-6 shadow-sm">
          <h1 className="text-4xl font-bold text-foreground">{isEditing ? 'Editar usuario' : 'Nuevo Usuario'}</h1>
          <p className="text-base text-foreground/70 mt-2">
            {isEditing
              ? 'Modifica los campos necesarios y guarda los cambios'
              : 'Completa la información para crear un nuevo usuario'}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Card de información básica */}
            <Card className="bg-card shadow-sm border border-border overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-foreground font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Información Básica</h3>
                    <p className="text-xs text-muted-foreground">Datos principales del usuario</p>
                  </div>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground mb-1 block">Email</Label>
                  <InputGlobal id="email" {...form.register('email')} placeholder="Email" autoComplete="off" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                {/* Solo mostrar contraseña en modo creación */}
                {!isEditing && (
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-foreground mb-1 block">Contraseña provisional</Label>
                    <InputGlobal id="password" type="password" {...form.register('password', { required: !isEditing })} placeholder="Contraseña temporal" autoComplete="new-password" />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>
                )}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-1 block">Teléfono</Label>
                  <InputGlobal id="phone" {...form.register('phone')} placeholder="Teléfono" autoComplete="off" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-foreground mb-1 block">Nombre</Label>
                  <InputGlobal id="firstName" {...form.register('firstName')} placeholder="Nombre" autoComplete="off" />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-foreground mb-1 block">Apellido</Label>
                  <InputGlobal id="lastName" {...form.register('lastName')} placeholder="Apellido" autoComplete="off" />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
                {/* Campos dinámicos por rol */}
                {form.watch('activeRole') === UserRole.COURIER && (
                  <>
                    <div>
                      <Label htmlFor="vehicleType" className="text-sm font-medium text-foreground mb-1 block">Tipo de vehículo</Label>
                      <SelectGlobal id="vehicleType" {...form.register('vehicleType', { required: true })}>
                        <option value="">Selecciona una opción</option>
                        <option value="bike">Bicicleta</option>
                        <option value="motorcycle">Moto</option>
                        <option value="car">Auto</option>
                        <option value="walking">A pie</option>
                      </SelectGlobal>
                      {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="vehiclePlate" className="text-sm font-medium text-foreground mb-1 block">Placa del vehículo</Label>
                      <InputGlobal id="vehiclePlate" {...form.register('vehiclePlate')} placeholder="Placa (opcional)" />
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber" className="text-sm font-medium text-foreground mb-1 block">Número de licencia</Label>
                      <InputGlobal id="licenseNumber" {...form.register('licenseNumber')} placeholder="Licencia (opcional)" />
                    </div>
                    <div>
                      <Label htmlFor="workingZones" className="text-sm font-medium text-foreground mb-1 block">Zonas de trabajo</Label>
                      <InputGlobal id="workingZones" {...form.register('workingZones')} placeholder="Ej: Miraflores, Surco" />
                      <span className="text-xs text-muted-foreground">Separar por coma</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isAvailable" {...form.register('isAvailable')} className="accent-primary" />
                      <Label htmlFor="isAvailable" className="text-sm font-medium text-foreground">Disponible para repartir</Label>
                    </div>
                  </>
                )}
                {form.watch('activeRole') === UserRole.SELLER && (
                  <>
                    <div>
                      <Label htmlFor="businessName" className="text-sm font-medium text-foreground mb-1 block">Nombre del negocio</Label>
                      <InputGlobal id="businessName" {...form.register('businessName', { required: true })} placeholder="Nombre del negocio" />
                    </div>
                    <div>
                      <Label htmlFor="businessType" className="text-sm font-medium text-foreground mb-1 block">Tipo de negocio</Label>
                      <InputGlobal id="businessType" {...form.register('businessType', { required: true })} placeholder="Ej: Restaurante, Tienda" />
                    </div>
                    <div>
                      <Label htmlFor="taxId" className="text-sm font-medium text-foreground mb-1 block">RUC / NIT</Label>
                      <InputGlobal id="taxId" {...form.register('taxId')} placeholder="RUC/NIT (opcional)" />
                    </div>
                    <div>
                      <Label htmlFor="businessPhone" className="text-sm font-medium text-foreground mb-1 block">Teléfono del negocio</Label>
                      <InputGlobal id="businessPhone" {...form.register('businessPhone', { required: true })} placeholder="Teléfono del negocio" />
                    </div>
                    <div>
                      <Label htmlFor="businessEmail" className="text-sm font-medium text-foreground mb-1 block">Email del negocio</Label>
                      <InputGlobal id="businessEmail" {...form.register('businessEmail', { required: true })} placeholder="Email del negocio" />
                    </div>
                    <div>
                      <Label htmlFor="businessAddress" className="text-sm font-medium text-foreground mb-1 block">Dirección del negocio</Label>
                      <InputGlobal id="businessAddress" {...form.register('businessAddress')} placeholder="Dirección (opcional)" />
                    </div>
                    <div>
                      <Label htmlFor="categories" className="text-sm font-medium text-foreground mb-1 block">Categorías</Label>
                      <InputGlobal id="categories" {...form.register('categories')} placeholder="Ej: Comida, Electrónica (separar por coma)" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isVerified" {...form.register('isVerified')} className="accent-primary" />
                      <Label htmlFor="isVerified" className="text-sm font-medium text-foreground">Negocio verificado</Label>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Card de configuración */}
            <Card className="bg-card shadow-sm border border-border overflow-hidden">
              <div className="bg-secondary/5 px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <span className="text-secondary-foreground font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Configuración</h3>
                    <p className="text-xs text-muted-foreground">Rol y estado del usuario</p>
                  </div>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="activeRole" className="text-sm font-medium text-foreground mb-1 block">Rol</Label>
                  <SelectGlobal id="activeRole" {...form.register('activeRole')}>
                    <option value={UserRole.CUSTOMER}>Cliente</option>
                    <option value={UserRole.SELLER}>Vendedor</option>
                    <option value={UserRole.COURIER}>Repartidor</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </SelectGlobal>
                </div>
                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-foreground mb-1 block">Estado</Label>
                  <SelectGlobal id="status" {...form.register('status')}>
                    <option value={UserStatus.ACTIVE}>Activo</option>
                    <option value={UserStatus.INACTIVE}>Inactivo</option>
                    <option value={UserStatus.SUSPENDED}>Suspendido</option>
                    <option value={UserStatus.PENDING_VERIFICATION}>Pendiente</option>
                  </SelectGlobal>
                </div>
              </div>
            </Card>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/users')}
                disabled={isSubmitting}
                className="flex-1 h-12 border-2 border-border hover:bg-muted text-foreground font-semibold"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-foreground font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting
                  ? 'Guardando...'
                  : isEditing
                    ? 'Guardar Cambios'
                    : 'Crear Usuario'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
