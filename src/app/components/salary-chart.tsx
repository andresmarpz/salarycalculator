import React, { useMemo } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { XAxis, YAxis, AreaChart, CartesianGrid, Area } from "recharts";
import { calcularImpuestos } from "../../../lib/calc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SalaryChartProps {
  salaryUSD: number;
  minRate?: number;
  maxRate?: number;
  step?: number;
}

export default function SalaryChart({
  salaryUSD,
  minRate = 35,
  maxRate = 50,
  step = 0.5,
}: SalaryChartProps) {
  const defs = useMemo(
    () => ({
      anio: new Date().getFullYear(),
      salarioNominal: 0,
      salarioNominalUSD: salaryUSD,
      cotizacionDolar: 0,
      tieneHijos: false,
      tieneConyuge: false,
      factorDeduccionPersonasACargo: 1,
      cantHijosSinDiscapacidad: 0,
      cantHijosConDiscapacidad: 0,
      aportesFondoSolidaridad: 0,
      adicionalFondoSolidaridad: false,
      aportesCJPPU: 0,
      otrasDeducciones: 0,
    }),
    [salaryUSD]
  );

  const chartData = useMemo(() => {
    return Array.from(
      { length: Math.floor((maxRate - minRate) / step) + 1 },
      (_, i) => {
        const rate = minRate + i * step;
        const result = calcularImpuestos({
          ...defs,
          salarioNominal: defs.salarioNominalUSD * rate,
        });
        return {
          rate,
          salary: result.salarioLiquido,
          salaryUSD: result.salarioLiquido / rate,
        };
      }
    );
  }, [defs, maxRate, minRate, step]);

  const chartConfig = {
    rate: {
      label: "Cotización",
      color: "hsl(var(--chart-1))",
    },
    salary: {
      label: "UYU",
      color: "hsl(var(--chart-1))",
    },
    salaryUSD: {
      label: "USD",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  if (salaryUSD === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salario vs Cotización</CardTitle>
        <CardDescription>
          Comparación entre salario y cotización del dólar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="rate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} USD`}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent labelKey="rate" />}
            />
            <defs>
              <linearGradient id="fillSalaryUSD" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-salaryUSD)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-salaryUSD)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSalary" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-salary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-salary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="salaryUSD"
              type="natural"
              fill="url(#fillSalaryUSD)"
              fillOpacity={0.5}
              stroke="var(--color-salaryUSD)"
              yAxisId="right"
              stackId="a"
            />
            <Area
              dataKey="salary"
              type="basis"
              fill="url(#fillSalary)"
              fillOpacity={0.6}
              stroke="var(--color-salary)"
              yAxisId="left"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
