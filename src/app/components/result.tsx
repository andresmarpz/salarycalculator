"use client";

import React from "react";

import {
  ADICIONAL_FONDO_SOLIDARIDAD,
  BPC,
  IRPF_FRANJAS,
  USD_VALUE,
} from "../../../lib/constants";
import { DetalleIRPF } from "../../../lib/calc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SalaryChart from "./salary-chart";

export interface SalaryResult {
  salarioLiquidoPesos: number;
  aportesJubilatorios: number;
  aportesFONASA: number;
  aporteFRL: number;
  detalleIRPF: DetalleIRPF | null;
  totalIRPF: number;
  aportesFondoSolidaridad: number;
  adicionalFondoSolidaridad: boolean;
  aportesCJPPU: number;
  exchangeRate: number;
}

function Result({ calculateFrom }: { calculateFrom: SalaryResult | null }) {
  if (!calculateFrom) return null;

  const {
    salarioLiquidoPesos,
    aportesJubilatorios,
    aportesFONASA,
    aporteFRL,
    detalleIRPF,
    totalIRPF,
    aportesFondoSolidaridad,
    adicionalFondoSolidaridad,
    aportesCJPPU,
    exchangeRate,
  } = calculateFrom;

  const totalFondoSolidaridadRedondeado = () =>
    Number(
      (aportesFondoSolidaridad * BPC.get(2024)!) / 12 + // TODO: Check not null
        (adicionalFondoSolidaridad ? ADICIONAL_FONDO_SOLIDARIDAD(2024)! : 0) // TODO: Check not null
    ); // .toFixed(2)

  const totalBPSRedondeado = () =>
    aportesJubilatorios + aportesFONASA + aporteFRL; //.toFixed(2)

  const totalDeducciones = () =>
    totalBPSRedondeado() + totalIRPF + aportesFondoSolidaridad;

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Resultado del cálculo</CardTitle>
        <CardDescription>Desglose de su salario líquido</CardDescription>
      </CardHeader>
      <CardContent>
        {salarioLiquidoPesos ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-muted p-4">
              <div className="text-sm text-muted-foreground">
                Salario líquido
              </div>
              <div className="flex flex-col">
                <div className="text-3xl font-bold">
                  $
                  {salarioLiquidoPesos.toLocaleString("es-UY", {
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-md text-muted-foreground">
                  USD{" "}
                  {(salarioLiquidoPesos / exchangeRate).toLocaleString(
                    "en-US",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Detalle BPS:</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Jubilatorio</TableCell>
                    <TableCell className="text-right">
                      $
                      {aportesJubilatorios.toLocaleString("es-UY", {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>FONASA</TableCell>
                    <TableCell className="text-right">
                      $
                      {aportesFONASA.toLocaleString("es-UY", {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>FRL</TableCell>
                    <TableCell className="text-right">
                      $
                      {aporteFRL.toLocaleString("es-UY", {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell>Total BPS</TableCell>
                    <TableCell className="text-right">
                      $
                      {totalBPSRedondeado().toLocaleString("es-UY", {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <h3 className="font-semibold pt-4">Detalle IRPF:</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Desde</TableHead>
                    <TableHead>Hasta</TableHead>
                    <TableHead>Tasa</TableHead>
                    <TableHead className="text-right">Impuesto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {IRPF_FRANJAS?.map((bracket, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{bracket.desde}</TableCell>
                      <TableCell>{bracket.hasta}</TableCell>
                      <TableCell>{bracket.tasa}%</TableCell>
                      <TableCell className="text-right">
                        $
                        {detalleIRPF?.impuestoFranja[index].toLocaleString(
                          "es-UY",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-semibold">
                    <TableCell colSpan={3}>Total IRPF</TableCell>
                    <TableCell className="text-right">
                      $
                      {totalIRPF.toLocaleString("es-UY", {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <h3 className="font-semibold pt-4">Detalle Profesionales:</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Fondo Solidaridad</TableCell>
                  <TableCell className="text-right">
                    $
                    {totalFondoSolidaridadRedondeado().toLocaleString("es-UY", {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Aportes CJPPU / Caja Notarial</TableCell>
                  <TableCell className="text-right">
                    $
                    {aportesCJPPU.toLocaleString("es-UY", {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Total de deducciones, suma de todos los detalles */}
            <div className="rounded-lg bg-muted p-4">
              <div className="text-sm text-muted-foreground">
                Total deducciones
              </div>
              <div className="text-3xl font-bold">
                $
                {totalDeducciones().toLocaleString("es-UY", {
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-[600px] items-center justify-center text-muted-foreground">
            Ingrese su salario y presione calcular para ver el desglose
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Result;
