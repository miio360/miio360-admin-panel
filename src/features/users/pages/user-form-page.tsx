import { useNavigate, useParams } from 'react-router-dom';
import { useUserForm } from '../hooks/useUserForm';
import { useUserFormSubmit } from '../hooks/useUserFormSubmit';
import { UserBasicFields } from '../components/user-basic-fields';
import { UserRoleFields } from '../components/user-role-fields';
import type { UserFormData } from '../user-form-schema';
import { ButtonGlobal } from '@/shared/components/button-global';
import { Card } from '@/shared/components/ui/card';
import { Form } from '@/shared/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import { FormActionsGlobal } from '@/shared/components/form-actions-global';

export default function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const form = useUserForm(id);
  const { formState: { isSubmitting, errors } } = form;
  const { onSubmit: handleSubmit } = useUserFormSubmit();

  const onSubmit = (data: UserFormData) => handleSubmit(data, isEditing, id);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <ButtonGlobal
            variant="ghost"
            onClick={() => navigate('/users')}
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
          >
            Volver a Usuarios
          </ButtonGlobal>
        </div>

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
            <Card className="bg-card shadow-sm border border-border overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-foreground font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Información básica</h3>
                  <p className="text-xs text-muted-foreground">Datos personales del usuario</p>
                </div>
              </div>
              <UserBasicFields 
                form={form} 
                isEditing={isEditing} 
                isSubmitting={isSubmitting} 
                errors={errors} 
              />
            </Card>

            <Card className="bg-card shadow-sm border border-border overflow-hidden">
              <div className="bg-secondary/5 px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="text-secondary-foreground font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Rol y permisos</h3>
                  <p className="text-xs text-muted-foreground">Define el rol y estado del usuario</p>
                </div>
              </div>
              <UserRoleFields 
                form={form} 
                isSubmitting={isSubmitting} 
                errors={errors} 
              />
            </Card>

            <FormActionsGlobal
              onCancel={() => navigate('/users')}
              isSubmitting={isSubmitting}
              isEditing={isEditing}
              submitText={{
                creating: "Crear usuario",
                editing: "Guardar cambios",
              }}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
