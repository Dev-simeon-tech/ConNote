export const getFormattedUnitValue = (value: number) => {
  // Handle non-finite values
  if (!isFinite(value)) return "Invalid";

  const absVal = Math.abs(value);
  const valueStr = value.toString();

  // Handle very small numbers with many leading zeros
  if (absVal < 0.000001 && absVal !== 0) {
    return value.toFixed(6).replace(/\.?0+$/, "");
  }

  // Handle large decimal precision
  const decimalPart = valueStr.split(".")[1];
  if (decimalPart && decimalPart.length > 14 && valueStr.startsWith("0.")) {
    return value.toExponential(6).replace(/\.?0+e/, "e"); // Clean trailing zeros before "e"
  }
  if (decimalPart && decimalPart.length > 6) return value.toFixed(5);
  // General formatting: commas + trim trailing zeros
  const rounded = parseFloat(value.toFixed(12)); // Clean up float precision mess
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 12,
  }).format(rounded);
};
