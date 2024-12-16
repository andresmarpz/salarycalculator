"use client";

import { useState } from "react";
import { calcularImpuestos } from "../../lib/calc";
import Result, { SalaryResult } from "@/app/components/result";

import SalaryForm, { FormType } from "@/app/components/salary-form";
import SalaryChart from "@/app/components/salary-chart";

export default function Home() {
  const [rawForm, setRawForm] = useState<FormType | null>(null);
  const [result, setResult] = useState<SalaryResult | null>(null);

  const handleFormSubmit = (data: FormType) => {
    const salarioNominal =
      data.moneda === "USD"
        ? parseFloat(data.salario) * parseFloat(data.exchangeRate)
        : parseFloat(data.salario);

    const calcResult = calcularImpuestos({
      anio: 2024,
      salarioNominal,
      tieneHijos: data.tieneHijos,
      tieneConyuge: data.tieneConyuge,
      factorDeduccionPersonasACargo: Number(data.factorDeduccionPersonasACargo),
      cantHijosSinDiscapacidad: data.cantHijosSinDiscapacidad,
      cantHijosConDiscapacidad: data.cantHijosConDiscapacidad,
      aportesFondoSolidaridad: Number(data.aportesFondoSolidaridad),
      adicionalFondoSolidaridad: data.adicionalFondoSolidaridad,
      aportesCJPPU: data.aportesCJPPU,
      otrasDeducciones: data.otrasDeducciones,
    });

    setRawForm(data);

    setResult({
      salarioLiquidoPesos: calcResult.salarioLiquido,
      aportesJubilatorios: calcResult.aportesJubilatorios,
      aportesFONASA: calcResult.aportesFONASA,
      aporteFRL: calcResult.aporteFRL,
      detalleIRPF: calcResult.detalleIRPF,
      totalIRPF: calcResult.totalIRPF,
      aportesFondoSolidaridad: Number(data.aportesFondoSolidaridad),
      adicionalFondoSolidaridad: data.adicionalFondoSolidaridad,
      aportesCJPPU: data.aportesCJPPU,
      exchangeRate: parseFloat(data.exchangeRate),
    });
  };

  return (
    <div className="bg-background p-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <SalaryForm onFormSubmitted={handleFormSubmit} />

          {result && <Result calculateFrom={result} />}
        </div>

        {rawForm && (
          <div className="mt-8">
            <SalaryChart salarioUSD={parseFloat(rawForm?.salario)} />
          </div>
        )}
      </div>
    </div>
  );
}
