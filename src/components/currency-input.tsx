"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormType } from "@/app/components/salary-form";

export function CurrencyInput() {
  const form = useFormContext<FormType>();

  const formValues = form.watch();
  const exchangeRate = formValues.exchangeRate;
  const currentSalario = formValues.salario;
  const currentMoneda = formValues.moneda;

  function handleCurrencyChange(value: FormType["moneda"]) {
    if (isNaN(parseFloat(formValues.salario))) return;

    switch (formValues.moneda) {
      case "USD": {
        if (value === "UYU") {
          form.setValue(
            "salario",
            String(
              (
                parseFloat(formValues.salario) * parseFloat(exchangeRate)
              ).toFixed(2)
            )
          );
        }
        break;
      }

      case "UYU": {
        if (value === "USD") {
          form.setValue(
            "salario",
            String(
              (
                parseFloat(formValues.salario) / parseFloat(exchangeRate)
              ).toFixed(2)
            )
          );
        }
        break;
      }
    }
  }

  const oppositeAmount =
    currentSalario && !isNaN(parseFloat(currentSalario))
      ? currentMoneda === "USD"
        ? String(
            (parseFloat(formValues.salario) * parseFloat(exchangeRate)).toFixed(
              2
            )
          )
        : String(
            (parseFloat(formValues.salario) / parseFloat(exchangeRate)).toFixed(
              2
            )
          )
      : "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <FormField
          control={form.control}
          name="salario"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Salario</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Inserte su salario bruto.."
                  className="font-mono"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="moneda"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moneda</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    handleCurrencyChange(value as FormType["moneda"]);
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="UYU">UYU</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      {oppositeAmount && (
        <p className="text-sm text-muted-foreground">
          ≈ {oppositeAmount} en{" "}
          {form.getValues("moneda") === "USD" ? "UYU" : "USD"}
        </p>
      )}
      {/* <p className="text-xs text-muted-foreground">
        Tasa de cambio: 1 USD = {exchangeRate.toFixed(2)} UYU
      </p> */}
    </div>
  );
}
