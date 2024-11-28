"use client";
import { ChangeEvent, useState } from "react";
import { calcularImpuestos, DetalleIRPF } from "../../lib/calc";
import styles from "./form.module.css";
import { BPC, TOPE_APORTES_JUBILATORIOS } from "../../lib/constants";
import Result from "@/app/components/result";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export interface IFormState {
  anio: number;
  salarioNominal: number;
  salarioUSD: number;
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
      salarioUSD: 0,
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

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target?.select();
  }

  return (
    <div>
      <form onSubmit={onFormSubmitted}>
        <div className={styles.formGrid}>
          <label htmlFor="anio">Año</label>
          <input
            id="anio"
            name="anio"
            className={styles.formInput}
            type="number"
            onChange={onFormElementChanged}
            defaultValue={state.formState.anio}
          />

          <label htmlFor="inputSalario">Salario nominal en pesos:</label>
          <input
            id="inputSalario"
            name="salarioNominal"
            className={styles.formInput}
            type="number"
            min="0"
            step="0.01"
            onFocus={handleFocus}
            value={state.formState.salarioNominal}
            onChange={onFormElementChanged}
            disabled={state.formState.salarioUSD > 0}
          />

          <label htmlFor="inputSalarioUSD">Salario en USD:</label>
          <input
            id="inputSalarioUSD"
            name="salarioUSD"
            className={styles.formInput}
            type="number"
            min="0"
            step="0.01"
            onFocus={handleFocus}
            value={state.formState.salarioUSD}
            onChange={(e) => {
              const usdValue = Number(e.target.value);
              const exchangeRate = state.formState.cotizacionDolar;
              setState({
                ...state,
                formState: {
                  ...state.formState,
                  salarioUSD: usdValue,
                  salarioNominal: usdValue * exchangeRate,
                  formValido: true,
                },
              });
            }}
          />

          <label htmlFor="inputCotizacion">Cotización del dólar:</label>
          <input
            id="inputCotizacion"
            name="cotizacionDolar"
            className={styles.formInput}
            type="number"
            min="0"
            step="0.01"
            onFocus={handleFocus}
            value={state.formState.cotizacionDolar}
            onChange={(e) => {
              const exchangeRate = Number(e.target.value);
              const usdValue = state.formState.salarioUSD;
              setState({
                ...state,
                formState: {
                  ...state.formState,
                  cotizacionDolar: exchangeRate,
                  salarioNominal: usdValue * exchangeRate,
                  formValido: true,
                },
              });
            }}
          />
        </div>

        {BPC.has(state.formState.anio) ? null : (
          <div className={classNames(styles.alert, styles.alertDanger)}>
            BPC no encontrado para el año {state.formState.anio}
          </div>
        )}

        {TOPE_APORTES_JUBILATORIOS.has(state.formState.anio) ? null : (
          <div className={classNames(styles.alert, styles.alertWarning)}>
            TOPE APORTE JUBILATORIO no encontrado para el año{" "}
            {state.formState.anio}, utilizando valor de{" "}
            {state.formState.anio - 1}
          </div>
        )}

        <h2 className={styles.formSection}>Cálculo de aportes BPS</h2>
        <div className={styles.formGrid}>
          <label htmlFor="inputHijosACargo">¿Tiene hijos a cargo?</label>
          <input
            id="inputHijosACargo"
            name="tieneHijos"
            className={styles.formInput}
            type="checkbox"
            checked={state.formState.tieneHijos}
            onChange={onFormElementChanged}
          />
          <label htmlFor="inputConyujeACargo">¿Tiene cónyuge a cargo?</label>
          <input
            id="inputConyujeACargo"
            name="tieneConyuge"
            className={styles.formInput}
            type="checkbox"
            checked={state.formState.tieneConyuge}
            onChange={onFormElementChanged}
          />
        </div>
        <h2 className={styles.formSection}>Cálculo de IRPF</h2>
        <h3 className={styles.formSubSection}>Cantidad de personas a cargo:</h3>
        <div className={styles.formGrid}>
          <label htmlFor="inputFactorDeduccion">
            Porcentaje de deducción de las personas a cargo:
          </label>
          <select
            id="inputFactorDeduccion"
            name="factorDeduccionPersonasACargo"
            className={styles.formInput}
            value={state.formState.factorDeduccionPersonasACargo}
            onChange={onFormElementChanged}
          >
            <option value="1">100%</option>
            <option value="0.5">50%</option>
            <option value="0">No deducción</option>
          </select>
          <label htmlFor="inputHijosSinDiscapacidad">
            Cantidad de hijos sin discapacidad:
          </label>
          <input
            id="inputHijosSinDiscapacidad"
            name="cantHijosSinDiscapacidad"
            className={styles.formInput}
            type="number"
            onFocus={handleFocus}
            min="0"
            value={state.formState.cantHijosSinDiscapacidad}
            onChange={onFormElementChanged}
          />
          <label htmlFor="inputHijosConDiscapacidad">
            Cantidad de hijos con discapacidad:
          </label>
          <input
            id="inputHijosConDiscapacidad"
            name="cantHijosConDiscapacidad"
            className={styles.formInput}
            type="number"
            onFocus={handleFocus}
            min="0"
            value={state.formState.cantHijosConDiscapacidad}
            onChange={onFormElementChanged}
          />
        </div>
        <h3 className={styles.formSubSection}>Si es profesional:</h3>
        <div className={styles.formGrid}>
          <label htmlFor="inputAportesFondoSolidaridad">
            ¿Aporta al Fondo de Solidaridad?
          </label>
          <select
            id="inputAportesFondoSolidaridad"
            name="aportesFondoSolidaridad"
            className={styles.formInput}
            value={state.formState.aportesFondoSolidaridad}
            onChange={onFormElementChanged}
          >
            <option value="0">No</option>
            <option value="0.5">1/2 BPC</option>
            <option value="1">1 BPC</option>
            <option value="2">2 BPC</option>
          </select>
          <label htmlFor="inputAdicionalFondoSolidaridad">
            ¿Adicional Fondo de Solidaridad?
          </label>
          <input
            id="inputAdicionalFondoSolidaridad"
            name="adicionalFondoSolidaridad"
            className={styles.formInput}
            type="checkbox"
            checked={state.formState.adicionalFondoSolidaridad}
            onChange={onFormElementChanged}
          />
          <label htmlFor="inputAportesCajaProfesionales">
            Aporte mensual a CJPPU o Caja Notarial:
          </label>
          <input
            id="inputAportesCajaProfesionales"
            name="aportesCJPPU"
            className={styles.formInput}
            type="number"
            onFocus={handleFocus}
            min="0"
            value={state.formState.aportesCJPPU}
            onChange={onFormElementChanged}
          />
          <label htmlFor="inputOtrasDeducciones">Otras deducciones:</label>
          <input
            id="inputOtrasDeducciones"
            name="otrasDeducciones"
            className={styles.formInput}
            type="number"
            onFocus={handleFocus}
            min="0"
            value={state.formState.otrasDeducciones}
            onChange={onFormElementChanged}
          />
        </div>
        {BPC.has(state.formState.anio) ? (
          <button key={+new Date()} className={styles.btnSubmit}>
            Calcular
          </button>
        ) : null}
      </form>

      {state.result ? <Result calculateFrom={state.result} /> : null}
    </div>
  );
}
