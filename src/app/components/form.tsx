"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface IFormState {
  anio: number;
  salarioNominal: number;
  tieneHijos: boolean;
  tieneConyuge: boolean;
  factorDeduccionPersonasACargo: number;
  cantHijosSinDiscapacidad: number;
  cantHijosConDiscapacidad: number;
  aportesFondoSolidaridad: number;
  adicionalFondoSolidaridad: boolean;
  aportesCJPPU: number;
  otrasDeducciones: number;
  formValido: boolean;
}

export default function Form({
  onFormElementChanged,
  onFormSubmitted,
  formState,
}: {
  onFormElementChanged: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onFormSubmitted: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLFormElement>
  ) => void;
  formState: IFormState;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cálculo de salario</CardTitle>
        <CardDescription>
          Ingrese los datos para calcular su salario líquido
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onFormSubmitted} className="space-y-6">
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Año</Label>
                <Input id="year" name="anio" value={formState.anio} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salary">Salario nominal en pesos</Label>
                <Input
                  id="salary"
                  name="salarioNominal"
                  type="number"
                  value={formState.salarioNominal}
                  onChange={onFormElementChanged}
                  required
                />
              </div>
            </div>

            {/* BPS Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Cálculo de aportes BPS</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasChildren"
                    name="tieneHijos"
                    checked={formState.tieneHijos}
                    onCheckedChange={(checked) =>
                      onFormElementChanged({
                        target: {
                          name: "tieneHijos",
                          type: "checkbox",
                          checked: checked === true,
                        },
                      } as never)
                    }
                  />
                  <Label htmlFor="hasChildren">¿Tiene hijos a cargo?</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasSpouse"
                    name="tieneConyuge"
                    checked={formState.tieneConyuge}
                    onCheckedChange={(checked) =>
                      onFormElementChanged({
                        target: {
                          name: "tieneConyuge",
                          type: "checkbox",
                          checked: checked === true,
                        },
                      } as never)
                    }
                  />
                  <Label htmlFor="hasSpouse">¿Tiene cónyuge a cargo?</Label>
                </div>
              </div>
            </div>

            {/* IRPF Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Cálculo de IRPF</h3>
              <h4 className="text-lg font-semibold">
                Cantidad de personas a cargo:
              </h4>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Porcentaje de deducción de las personas a cargo</Label>
                  <Select
                    name="factorDeduccionPersonasACargo"
                    value={formState.factorDeduccionPersonasACargo.toString()}
                    onValueChange={(value) =>
                      onFormElementChanged({
                        target: {
                          name: "factorDeduccionPersonasACargo",
                          value: value,
                        },
                      } as never)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione porcentaje" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">100%</SelectItem>
                      <SelectItem value="0.5">50%</SelectItem>
                      <SelectItem value="0">No deducción</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="childrenWithoutDisability">
                    Cantidad de hijos sin discapacidad
                  </Label>
                  <Input
                    id="childrenWithoutDisability"
                    name="cantHijosSinDiscapacidad"
                    type="number"
                    value={formState.cantHijosSinDiscapacidad}
                    onChange={onFormElementChanged}
                    min="0"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="childrenWithDisability">
                    Cantidad de hijos con discapacidad
                  </Label>
                  <Input
                    id="childrenWithDisability"
                    name="cantHijosConDiscapacidad"
                    type="number"
                    value={formState.cantHijosConDiscapacidad}
                    onChange={onFormElementChanged}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Professional Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Si es profesional:</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>¿Aporta al Fondo de Solidaridad?</Label>
                  <Select
                    name="aportesFondoSolidaridad"
                    value={formState.aportesFondoSolidaridad.toString()}
                    onValueChange={(value) =>
                      onFormElementChanged({
                        target: {
                          name: "aportesFondoSolidaridad",
                          value: value,
                        },
                      } as never)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="0.5">1/2 BPC</SelectItem>
                      <SelectItem value="1">1 BPC</SelectItem>
                      <SelectItem value="2">2 BPC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="additionalSolidarityFund"
                    name="adicionalFondoSolidaridad"
                    checked={formState.adicionalFondoSolidaridad}
                    onCheckedChange={(checked) =>
                      onFormElementChanged({
                        target: {
                          name: "adicionalFondoSolidaridad",
                          type: "checkbox",
                          checked: checked === true,
                        },
                      } as never)
                    }
                  />
                  <Label htmlFor="additionalSolidarityFund">
                    ¿Adicional Fondo de Solidaridad?
                  </Label>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cjppuContribution">
                    Aporte mensual a CJPPU o Caja Notarial
                  </Label>
                  <Input
                    id="cjppuContribution"
                    name="aportesCJPPU"
                    type="number"
                    value={formState.aportesCJPPU}
                    onChange={onFormElementChanged}
                    min="0"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="otherDeductions">Otras deducciones</Label>
                  <Input
                    id="otherDeductions"
                    name="otrasDeducciones"
                    type="number"
                    value={formState.otrasDeducciones}
                    onChange={onFormElementChanged}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Calcular
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
