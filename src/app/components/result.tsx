"use client";

import React from "react";

import {
  ADICIONAL_FONDO_SOLIDARIDAD,
  BPC,
  IRPF_FRANJAS,
  NUMERAL_CURRENCY_FORMAT_STRING,
  NUMERAL_FORMAT_STRING,
} from "../../../lib/constants";
import styles from "./result.module.css";
import { DetalleIRPF } from "../../../lib/calc";
import { formatCurrency } from "@/app/numeral";

interface IProps {
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
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function Result({ calculateFrom }: { calculateFrom: IProps }) {
  const {
    anio,
    salarioLiquido,
    aportesJubilatorios,
    aportesFONASA,
    aporteFRL,
    detalleIRPF,
    totalIRPF,
    aportesFondoSolidaridad,
    adicionalFondoSolidaridad,
    aportesCJPPU,
  } = calculateFrom;

  // useEffect(() => {
  //   console.log("Result: useEffect", calculateFrom)
  //   window.scrollTo(0, 0)
  // }, [])

  // Para evitar que el usuario navegue directamente a esta pagina sin pasar por el formulario
  // if (!formSubmitted) {
  //   history.push("/")
  //   return <span>Redirigiendo...</span>
  // }

  const totalFondoSolidaridadRedondeado = () =>
    Number(
      (aportesFondoSolidaridad * BPC.get(anio)!) / 12 + // TODO: Check not null
        (adicionalFondoSolidaridad ? ADICIONAL_FONDO_SOLIDARIDAD(anio)! : 0) // TODO: Check not null
    ); // .toFixed(2)

  const aportesCJPPURedondeado = () => aportesCJPPU; // Number(aportesCJPPU.toFixed(2))

  const totalBPSRedondeado = () =>
    aportesJubilatorios + aportesFONASA + aporteFRL; //.toFixed(2)

  return (
    <div className={styles.result}>
      <div className={styles.liquido}>
        <span className={styles.liquidoLabel}> Salario líquido:</span>{" "}
        <span className={styles.liquidoDato}>
          {formatCurrency(salarioLiquido)}
        </span>
        {totalFondoSolidaridadRedondeado() || aportesCJPPURedondeado() ? (
          <span className={styles.liquidoInfo}>
            <span className={styles.liquidoInfoItem}>?</span>
            <span className={styles.liquidoTooltip}>
              El salario líquido es el nominal menos los descuentos de BPS e
              IRPF, antes de los descuentos profesionales.
            </span>
          </span>
        ) : null}
      </div>
      <h2 className={styles.resultSection}>Detalle BPS:</h2>
      <div className={styles.detalleBPS}>
        <span className={styles.tablaBPSLabel}>Jubilatorio</span>
        <span className={styles.tablaBPSDato}>
          {formatCurrency(aportesJubilatorios)}
        </span>
        <span className={styles.tablaBPSLabel}>FONASA</span>
        <span className={styles.tablaBPSDato}>
          {formatCurrency(aportesFONASA)}
        </span>
        <span className={styles.tablaBPSLabel}>FRL</span>
        <span className={styles.tablaBPSDato}>{formatCurrency(aporteFRL)}</span>
        <span className={styles.tablaBPSLabel}>Total BPS:</span>
        <span className={classNames(styles.tablaBPSDato, styles.totalBPS)}>
          {formatCurrency(totalBPSRedondeado())}
        </span>
      </div>
      <h2 className={styles.resultSection}>Detalle IRPF:</h2>
      <div className={styles.detalleIRPF}>
        <span className={styles.tablaIRPFHead}>Desde</span>
        <span className={styles.tablaIRPFHead}>Hasta</span>
        <span className={styles.tablaIRPFHead}>Tasa</span>
        <span className={styles.tablaIRPFHead}>Impuesto:</span>
        {IRPF_FRANJAS.map((franja, index) => {
          return (
            <React.Fragment key={`irpf${index}`}>
              <span className={styles.tablaIRPFDato}>{franja.desde} BPC</span>
              <span className={styles.tablaIRPFDato}>
                {franja.hasta !== 0 ? franja.hasta + " BPC" : "-"}
              </span>
              <span className={styles.tablaIRPFDato}>{franja.tasa}%</span>
              <span className={styles.tablaIRPFDato}>
                {formatCurrency(detalleIRPF?.impuestoFranja[index] ?? 0)}
              </span>
            </React.Fragment>
          );
        })}
      </div>
      <div className={styles.resumenIRPF}>
        <span className={styles.resumenIRPFLabel}>Deducciones:</span>
        <span
          className={classNames(
            styles.resumenIRPFDato,
            styles.resumenIRPFDeducciones
          )}
        >
          {detalleIRPF?.deducciones
            ? formatCurrency(detalleIRPF.deducciones)
            : 0}
        </span>
        <span className={styles.resumenIRPFLabel}>Tasa deducciones:</span>
        <span
          className={classNames(styles.resumenIRPFDato, styles.resumenIRPFTasa)}
        >
          {detalleIRPF?.tasaDeducciones ?? 0}%
        </span>
        <span className={styles.resumenIRPFLabelTotal}>Total IRPF:</span>
        <span
          className={classNames(
            styles.resumenIRPFDato,
            styles.resumenIRPFTotal
          )}
        >
          {formatCurrency(totalIRPF)}
        </span>
      </div>
      <h2 className={styles.resultSection}>Profesionales:</h2>
      <div className={styles.detalleProfesionales}>
        <span className={styles.tablaProfesionalesLabel}>
          Fondo Solidaridad:
        </span>
        <span className={styles.tablaProfesionalesDato}>
          {formatCurrency(totalFondoSolidaridadRedondeado())}
        </span>
        <span className={styles.tablaProfesionalesLabel}>
          Aportes CJPPU / Caja Notarial:
        </span>
        <span className={styles.tablaProfesionalesDato}>
          {formatCurrency(aportesCJPPURedondeado())}
        </span>
      </div>
    </div>
  );
}

export default Result;
