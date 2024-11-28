"use client";

import { ChangeEvent, useState } from "react";
import { calcularImpuestos, DetalleIRPF } from "../../lib/calc";
import Result from "@/app/components/result";

import Form from "@/app/components/form";

export interface IFormState {
  anio: number;
  salarioNominal: number;
  salarioNominalUSD: number;
  cotizacionDolar: number;
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

interface IState {
  formState: IFormState;
  result: {
    anio: number;
    formSubmitted: boolean;
    salarioLiquido: number;
    aportesJubilatorios: number;
    aportesFONASA: number;
    aporteFRL: number;
    detalleIRPF: DetalleIRPF | null;
    totalIRPF: number;
    aportesFondoSolidaridad: number;
    adicionalFondoSolidaridad: boolean;
    aportesCJPPU: number;
  } | null;
}

export default function Home() {
  const [state, setState] = useState<IState>({
    formState: {
      anio: new Date().getFullYear(),
      salarioNominal: 0,
      salarioNominalUSD: 0,
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
      formValido: true,
    },
    result: null,
  });

  /**
   * Función que se llama cuando el usuario modifica alguno de los inputs del formulario.
   */
  function onFormElementChanged(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : Number(e.target.value);

    setState({
      ...state,
      formState: {
        ...state.formState,
        [name]: value,
        formValido: true,
      },
    });
  }

  /**
   * Función que se llama cuando el usuario hace submit en el formulario.
   */
  function onFormSubmitted(
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (state.formState.salarioNominal > 0) {
      const {
        salarioLiquido,
        aportesJubilatorios,
        aportesFONASA,
        aporteFRL,
        detalleIRPF,
        totalIRPF,
      } = calcularImpuestos(
        state.formState.anio,
        state.formState.salarioNominal,
        state.formState.tieneHijos,
        state.formState.tieneConyuge,
        state.formState.factorDeduccionPersonasACargo,
        state.formState.cantHijosSinDiscapacidad,
        state.formState.cantHijosConDiscapacidad,
        state.formState.aportesFondoSolidaridad,
        state.formState.adicionalFondoSolidaridad,
        state.formState.aportesCJPPU,
        state.formState.otrasDeducciones
      );

      if (salarioLiquido >= 0) {
        setState({
          ...state,
          result: {
            anio: state.formState.anio,
            formSubmitted: true,
            salarioLiquido: salarioLiquido,
            aportesJubilatorios: aportesJubilatorios,
            aportesFONASA: aportesFONASA,
            aporteFRL: aporteFRL,
            detalleIRPF: detalleIRPF,
            totalIRPF: totalIRPF,
            aportesFondoSolidaridad: state.formState.aportesFondoSolidaridad,
            adicionalFondoSolidaridad:
              state.formState.adicionalFondoSolidaridad,
            aportesCJPPU: state.formState.aportesCJPPU,
          },
          formState: {
            ...state.formState,
            formValido: true,
          },
        });
      } else {
        setState({
          ...state,
          result: null,
          formState: {
            ...state.formState,
            formValido: false,
          },
        });
      }
    } else {
      setState({
        ...state,
        result: null,
        formState: {
          ...state.formState,
          formValido: false,
        },
      });
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <Form
            onFormElementChanged={onFormElementChanged}
            onFormSubmitted={onFormSubmitted}
            formState={state.formState}
          />

          <Result calculateFrom={state.result} />
        </div>
      </div>
    </div>
  );
}
