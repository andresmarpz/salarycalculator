interface FormatConfig {
  delimiters: {
    thousands: string;
    decimal: string;
  };
  abbreviations: {
    thousand: string;
    million: string;
    billion: string;
    trillion: string;
  };
  currency: {
    symbol: string;
  };
}

const UY_CONFIG: FormatConfig = {
  delimiters: {
    thousands: ".",
    decimal: ",",
  },
  abbreviations: {
    thousand: "k",
    million: "m",
    billion: "mm",
    trillion: "b",
  },
  currency: {
    symbol: "$U",
  },
};

export function formatNumber(value: number, format?: string): string {
  const isNegative = value < 0;
  value = Math.abs(value);

  // Round to 2 decimal places
  value = Number(Math.round(Number(value + "e2")) + "e-2");

  let result = value.toString();

  // Handle decimal places
  const parts = result.split(".");
  let integerPart = parts[0];
  const decimalPart = parts[1] || "";

  // Add thousand separators
  integerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    UY_CONFIG.delimiters.thousands
  );

  // Combine parts
  result = decimalPart
    ? `${integerPart}${UY_CONFIG.delimiters.decimal}${decimalPart}`
    : integerPart;

  // Add currency symbol if format includes '$'
  if (format?.includes("$")) {
    result = `${UY_CONFIG.currency.symbol}${result}`;
  }

  return isNegative ? `-${result}` : result;
}

export function getOrdinal(number: number): string {
  const b = number % 10;
  return b === 1 || b === 3
    ? "er"
    : b === 2
    ? "do"
    : b === 7 || b === 0
    ? "mo"
    : b === 8
    ? "vo"
    : b === 9
    ? "no"
    : "to";
}

export function formatCurrency(value: number): string {
  return formatNumber(value, "$");
}
