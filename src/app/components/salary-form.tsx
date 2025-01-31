import { CurrencyInput } from "@/components/currency-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  anio: z
    .string()
    .refine((value) => parseInt(value) >= 2021 && parseInt(value) <= 2025, {
      message: "El año debe ser mayor a 2021 y menor a 2025",
    }),
  salario: z.string().refine((value) => parseFloat(value) > 0, {
    message: "El salario debe ser mayor a 0",
  }),
  moneda: z.enum(["UYU", "USD"]),
  exchangeRate: z.string().refine((value) => parseFloat(value) > 0, {
    message: "La tasa de cambio debe ser mayor a 0",
  }),
  tieneHijos: z.boolean().default(false),
  tieneConyuge: z.boolean().default(false),
  factorDeduccionPersonasACargo: z.enum(["100", "50", "0"]).default("100"),
  cantHijosSinDiscapacidad: z.number().default(0),
  cantHijosConDiscapacidad: z.number().default(0),
  aportesFondoSolidaridad: z.enum(["0", "0.5", "1", "2"]).default("0"),
  adicionalFondoSolidaridad: z.boolean().default(false),
  aportesCJPPU: z.number().min(0).default(0),
  otrasDeducciones: z.number().min(0).default(0),
});

export type FormType = z.infer<typeof formSchema>;

export default function SalaryForm({
  onFormSubmitted,
}: {
  onFormSubmitted: (data: FormType) => unknown;
}) {
  const form = useForm<FormType>({
    defaultValues: {
      anio: "2025",
      salario: "",
      moneda: "UYU",
      exchangeRate: "45.75",
      tieneHijos: false,
      tieneConyuge: false,
      factorDeduccionPersonasACargo: "100",
      cantHijosSinDiscapacidad: 0,
      cantHijosConDiscapacidad: 0,
      aportesFondoSolidaridad: "0",
      adicionalFondoSolidaridad: false,
      aportesCJPPU: 0,
      otrasDeducciones: 0,
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmitted)}>
        <section>
          <div className="rounded-lg border border-b-0 bg-card p-4 text-card-foreground shadow-sm flex flex-col gap-2">
            <FormField
              name="anio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione año" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <CurrencyInput />

            <FormField
              control={form.control}
              name="exchangeRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasa de cambio (UYU/USD)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      pattern="\d+(\.\d{1,2})?"
                      placeholder="Tasa de cambio..."
                    />
                  </FormControl>
                  <FormDescription>
                    Ingrese la tasa de cambio UYU/USD para los cálculos
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </section>

        <section>
          {/* BPS Section */}
          <div className="rounded-lg border border-b-0 bg-card p-4 text-card-foreground shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              Cálculo de aportes BPS
            </h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="tieneHijos"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>¿Tiene hijos a cargo?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tieneConyuge"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>¿Tiene cónyuge a cargo?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </section>

        <section>
          {/* IRPF Section */}
          <div className="rounded-lg border border-b-0 bg-card p-4 text-card-foreground shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Cálculo de IRPF</h3>
            <div className="space-y-4">
              <h4 className="text-base font-medium text-muted-foreground">
                Cantidad de personas a cargo:
              </h4>
              <FormField
                control={form.control}
                name="factorDeduccionPersonasACargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porcentaje de deducción</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione porcentaje" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="100">100%</SelectItem>
                        <SelectItem value="50">50%</SelectItem>
                        <SelectItem value="0">No deducción</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cantHijosSinDiscapacidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hijos sin discapacidad</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cantHijosConDiscapacidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hijos con discapacidad</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          {/* Professional Section */}
          <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Si es profesional:</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="aportesFondoSolidaridad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Aporta al Fondo de Solidaridad?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione opción" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">No</SelectItem>
                          <SelectItem value="0.5">1/2 BPC</SelectItem>
                          <SelectItem value="1">1 BPC</SelectItem>
                          <SelectItem value="2">2 BPC</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adicionalFondoSolidaridad"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>¿Adicional Fondo de Solidaridad?</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aportesCJPPU"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Aporte mensual a CJPPU o Caja Notarial
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otrasDeducciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Otras deducciones</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <Button
            type="submit"
            className="w-full bg-blue-700 text-white h-14 font-mono font-bold uppercase hover:bg-blue-600"
          >
            Calcular
          </Button>
        </section>
      </form>
    </Form>
  );
}
