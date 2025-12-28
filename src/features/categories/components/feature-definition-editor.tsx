import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import type { FeatureDefinition, FeatureType } from '@/shared/types';

interface FeatureDefinitionEditorProps {
  featureDefinitions: FeatureDefinition[];
  onChange: (definitions: FeatureDefinition[]) => void;
  inputClassName?: string;
}

export function FeatureDefinitionEditor({
  featureDefinitions,
  onChange,
  inputClassName = '',
}: FeatureDefinitionEditorProps) {
  const addFeature = () => {
    const newFeature: FeatureDefinition = {
      key: '',
      label: '',
      type: 'text',
      required: false,
      order: featureDefinitions.length,
      placeholder: '',
    };
    onChange([...featureDefinitions, newFeature]);
  };

  const updateFeature = (index: number, field: keyof FeatureDefinition, value: any) => {
    const updated = [...featureDefinitions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeFeature = (index: number) => {
    const updated = featureDefinitions.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === featureDefinitions.length - 1) return;

    const updated = [...featureDefinitions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // Actualizar orden
    updated.forEach((feature, i) => {
      feature.order = i;
    });

    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Definición de Características</CardTitle>
        <p className="text-sm text-muted-foreground">
          Define los campos que tendrán los productos de esta subcategoría
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {featureDefinitions.map((feature, index) => (
          <div key={feature.key ? feature.key : `feature-${index}`} className="feature-box">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Clave (key) *</Label>
                  <Input
                    value={feature.key}
                    onChange={(e) => updateFeature(index, 'key', e.target.value)}
                    placeholder="ej: color, memoria, peso"
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Etiqueta (label) *</Label>
                  <Input
                    value={feature.label}
                    onChange={(e) => updateFeature(index, 'label', e.target.value)}
                    placeholder="ej: Color, Memoria, Peso"
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select
                    value={feature.type}
                    onValueChange={(value: FeatureType) =>
                      updateFeature(index, 'type', value)
                    }
                  >
                    <SelectTrigger className={inputClassName}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Unidad</Label>
                  <Input
                    value={feature.unit || ''}
                    onChange={(e) => updateFeature(index, 'unit', e.target.value)}
                    placeholder="ej: kg, cm, GB"
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Orden</Label>
                  <Input
                    type="number"
                    value={feature.order}
                    onChange={(e) =>
                      updateFeature(index, 'order', Number(e.target.value))
                    }
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Placeholder</Label>
                <Input
                  value={feature.placeholder || ''}
                  onChange={(e) => updateFeature(index, 'placeholder', e.target.value)}
                  placeholder="Texto de ayuda para el usuario"
                  className={inputClassName}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={feature.required}
                  onCheckedChange={(checked) =>
                    updateFeature(index, 'required', checked)
                  }
                />
                <Label>Campo requerido</Label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveFeature(index, 'up')}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveFeature(index, 'down')}
                  disabled={index === featureDefinitions.length - 1}
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addFeature}
          className="w-full"
        >
          + Agregar Característica
        </Button>
      </CardContent>
    </Card>
  );
}
