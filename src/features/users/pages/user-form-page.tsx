import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserForm } from '../hooks/useUserForm';
import { useUserFormSubmit } from '../hooks/useUserFormSubmit';
import { UserProfileStep } from '../components/user-profile-step';
import { UserRoleStep } from '../components/user-role-step';
import { SellerProfileStep } from '../components/seller-profile-step';
import { CourierProfileStep } from '../components/courier-profile-step';
import type { UserFormData } from '../user-form-schema';
import { ButtonGlobal } from '@/shared/components/button-global';
import { Card } from '@/shared/components/ui/card';
import { Form } from '@/shared/components/ui/form';
import { StepperGlobal } from '@/shared/components/stepper-global';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { UserRole } from '@/shared/types';

export default function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const form = useUserForm(id);
  const { formState: { isSubmitting } } = form;
  const { onSubmit: handleSubmit } = useUserFormSubmit();
  const [currentStep, setCurrentStep] = useState(0);

  const activeRole = form.watch('activeRole');

  const getSteps = () => {
    const baseSteps = ['Perfil', 'Rol'];
    if (activeRole === UserRole.SELLER) {
      return [...baseSteps, 'Negocio'];
    }
    if (activeRole === UserRole.COURIER) {
      return [...baseSteps, 'Repartidor'];
    }
    return baseSteps;
  };

  const steps = getSteps();
  const isLastStep = currentStep === steps.length - 1;

  const validateCurrentStep = async () => {
    const fieldsToValidate: (keyof UserFormData)[] = [];
    
    if (currentStep === 0) {
      fieldsToValidate.push('firstName', 'lastName', 'email', 'phone', 'password');
    } else if (currentStep === 1) {
      fieldsToValidate.push('activeRole', 'status');
    } else if (currentStep === 2 && activeRole === UserRole.SELLER) {
      fieldsToValidate.push('businessName', 'businessType', 'businessPhone', 'businessEmail');
    } else if (currentStep === 2 && activeRole === UserRole.COURIER) {
      fieldsToValidate.push('vehicleType');
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: UserFormData) => handleSubmit(data, isEditing, id);

  const renderStep = () => {
    if (currentStep === 0) {
      return <UserProfileStep form={form} isSubmitting={isSubmitting} />;
    }
    if (currentStep === 1) {
      return <UserRoleStep form={form} isSubmitting={isSubmitting} />;
    }
    if (currentStep === 2 && activeRole === UserRole.SELLER) {
      return <SellerProfileStep form={form} isSubmitting={isSubmitting} />;
    }
    if (currentStep === 2 && activeRole === UserRole.COURIER) {
      return <CourierProfileStep form={form} isSubmitting={isSubmitting} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen max-w-screen bg-background">
      <div className="px-6 py-8 max-w-5xl mx-auto">
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
              : 'Completa la información paso a paso para crear un nuevo usuario'}
          </p>
        </div>

        <Card className="bg-card shadow-sm border border-border overflow-hidden">
          <StepperGlobal steps={steps} currentStep={currentStep} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {renderStep()}

              <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-border">
                <ButtonGlobal
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || isSubmitting}
                  icon={<ArrowLeft className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Anterior
                </ButtonGlobal>

                {!isLastStep ? (
                  <ButtonGlobal
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                    className="bg-primary hover:bg-primary/90 text-foreground"
                  >
                    Siguiente
                  </ButtonGlobal>
                ) : (
                  <ButtonGlobal
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-foreground"
                  >
                    {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear usuario'}
                  </ButtonGlobal>
                )}
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
