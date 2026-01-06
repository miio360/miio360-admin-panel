import { useAuth } from '@/shared/hooks/useAuth';
import { CardGlobal, CardGlobalContent } from '@/shared/components/card-global';
import { ButtonGlobal } from '@/shared/components/button-global';
import { LogOut } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export default function UserProfilePage() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-lg text-gray-500">No hay información de usuario</span>
      </div>
    );
  }

  const { profile, activeRole, roles, status, sellerProfile, courierProfile, createdAt, updatedAt, lastLoginAt } = user;
  const mainAddress = profile.addresses?.find((a) => a.isDefault) || profile.addresses?.[0];

  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return '-';
    return timestamp.toDate().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex justify-center items-center h-full p-6">
      <CardGlobal className="w-full max-w-2xl">
        <CardGlobalContent className="flex flex-col gap-6 p-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
              {profile?.firstName?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-foreground">{profile?.firstName} {profile?.lastName}</div>
              <div className="text-sm text-gray-500">{profile?.email}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-gray-500">Rol activo</div>
            <div className="text-foreground font-medium">{activeRole}</div>
            <div className="text-gray-500">Todos los roles</div>
            <div className="text-foreground">{roles.join(', ')}</div>
            <div className="text-gray-500">Estado</div>
            <div className="text-foreground font-medium">{status}</div>
            <div className="text-gray-500">Teléfono</div>
            <div className="text-foreground">{profile.phone}</div>
            <div className="text-gray-500">Email verificado</div>
            <div className="text-foreground">{profile.emailVerified ? 'Sí' : 'No'}</div>
            <div className="text-gray-500">Teléfono verificado</div>
            <div className="text-foreground">{profile.phoneVerified ? 'Sí' : 'No'}</div>
          </div>
          {mainAddress && (
            <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="font-semibold text-foreground mb-2">Dirección principal</div>
              <div className="text-sm text-foreground">
                {mainAddress.street}, {mainAddress.city}, {mainAddress.state}, {mainAddress.country}
              </div>
            </div>
          )}
          <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="font-semibold text-foreground mb-3">Información del sistema</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-gray-500">Fecha de registro</div>
              <div className="text-foreground">{formatDate(createdAt)}</div>
              <div className="text-gray-500">Última actualización</div>
              <div className="text-foreground">{formatDate(updatedAt)}</div>
              <div className="text-gray-500">Último acceso</div>
              <div className="text-foreground">{formatDate(lastLoginAt)}</div>
            </div>
          </div>
          {sellerProfile && (
            <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="font-semibold text-primary mb-2">Datos de vendedor</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Negocio</div>
                <div className="text-foreground">{sellerProfile.businessName}</div>
                <div className="text-gray-500">Tipo</div>
                <div className="text-foreground">{sellerProfile.businessType}</div>
                <div className="text-gray-500">Teléfono</div>
                <div className="text-foreground">{sellerProfile.businessPhone}</div>
                <div className="text-gray-500">Email</div>
                <div className="text-foreground">{sellerProfile.businessEmail}</div>
                <div className="text-gray-500">Verificado</div>
                <div className="text-foreground">{sellerProfile.isVerified ? 'Sí' : 'No'}</div>
                <div className="text-gray-500">Categorías</div>
                <div className="text-foreground">{sellerProfile.categories?.join(', ') || '-'}</div>
              </div>
            </div>
          )}
          {courierProfile && (
            <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="font-semibold text-primary mb-2">Datos de repartidor</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Tipo de vehículo</div>
                <div className="text-foreground">{courierProfile.vehicleType}</div>
                <div className="text-gray-500">Placa</div>
                <div className="text-foreground">{courierProfile.vehiclePlate || '-'}</div>
                <div className="text-gray-500">Licencia</div>
                <div className="text-foreground">{courierProfile.licenseNumber || '-'}</div>
                <div className="text-gray-500">Disponible</div>
                <div className="text-foreground">{courierProfile.isAvailable ? 'Sí' : 'No'}</div>
              </div>
            </div>
          )}
          <ButtonGlobal onClick={signOut} variant="destructive" className="w-full mt-2" icon={<LogOut className="w-4 h-4" />} iconPosition="left">
            Cerrar sesión
          </ButtonGlobal>
        </CardGlobalContent>
      </CardGlobal>
    </div>
  );
}
