interface FormatOptions {
  maxDecimals?: number;
  useScientific?: boolean;
  locale?: string;
  unitName?: string;
  preserveTrailingZeros?: boolean;
}

export const getFormattedUnitValue = (
  value: number,
  options: FormatOptions = {}
): string => {
  const {
    maxDecimals = 12,
    useScientific = false,
    locale = "en-US",
    unitName = "",
    preserveTrailingZeros = false,
  } = options;

  // Handle edge cases first
  if (!isFinite(value)) {
    if (isNaN(value)) return "Invalid";
    return value > 0 ? "∞" : "-∞";
  }

  if (value === 0) return "0";

  const absValue = Math.abs(value);

  // Determine the most appropriate formatting strategy
  const formatStrategy = determineFormatStrategy(absValue, useScientific);

  let formattedValue: string;

  switch (formatStrategy) {
    case "scientific":
      formattedValue = formatScientific(value, maxDecimals);
      break;

    case "precision":
      formattedValue = formatHighPrecision(value, maxDecimals, locale);
      break;

    case "standard":
    default:
      formattedValue = formatStandard(
        value,
        maxDecimals,
        locale,
        preserveTrailingZeros
      );
      break;
  }

  // Add unit if provided
  if (unitName) {
    formattedValue += ` ${unitName}`;
  }

  return formattedValue;
};

/**
 * Determines the best formatting strategy based on the new rules
 */
function determineFormatStrategy(
  absValue: number,
  forceScientific = false
): string {
  if (forceScientific) return "scientific";

  // Check for very long leading zeros (5+ leading zeros after decimal)
  if (absValue < 1e-7 && absValue !== 0) return "scientific";

  // Numbers with digits before AND after decimal point
  if (absValue >= 1) {
    const str = absValue.toString();
    if (str.includes(".") && str.split(".")[1].length > 0) {
      return "precision"; // Will be handled with 4-5 decimal places
    }
  }

  // Numbers with leading zeros (0.xxxx format)
  if (absValue < 1 && absValue > 0) {
    const leadingZeros = countLeadingZerosAfterDecimal(absValue);
    if (leadingZeros >= 2) {
      return "significant"; // 4 significant figures
    } else if (leadingZeros === 1) {
      return "significant"; // 6-7 significant figures
    }
  }

  return "standard";
}

/**
 * Count leading zeros after decimal point
 */
function countLeadingZerosAfterDecimal(value: number): number {
  if (value >= 1) return 0;

  const str = value.toString();
  if (!str.includes(".")) return 0;

  const decimalPart = str.split(".")[1];
  let leadingZeros = 0;

  for (const char of decimalPart) {
    if (char === "0") {
      leadingZeros++;
    } else {
      break;
    }
  }

  return leadingZeros;
}

/**
 * Format to significant figures based on leading zeros
 */
function formatToSignificantFigures(value: number, sigFigs: number): string {
  if (value === 0) return "0";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  // Find the magnitude (power of 10)
  const magnitude = Math.floor(Math.log10(absValue));

  // Calculate the factor to get the desired significant figures
  const factor = Math.pow(10, sigFigs - magnitude - 1);

  // Round to significant figures
  const rounded = Math.round(absValue * factor) / factor;

  // Format the result
  let result = rounded.toString();

  // Remove trailing zeros unless they're significant
  if (result.includes(".")) {
    result = result.replace(/\.?0+$/, "");
  }

  return sign + result;
}

/**
 * Scientific notation formatter with clean output
 */
function formatScientific(value: number, maxDecimals: number): string {
  const scientific = value.toExponential(Math.min(maxDecimals, 6));

  // Clean up the scientific notation
  return scientific
    .replace(/\.?0+e/, "e") // Remove trailing zeros before 'e'
    .replace(/e\+?0+/, "") // Remove unnecessary +0 in exponent
    .replace(/e\+/, "e") // Remove + sign for positive exponents
    .replace(/e(-?)(\d)$/, "e$1$2"); // Ensure proper exponent format
}

/**
 * High precision formatting for numbers with digits before and after decimal
 */
function formatHighPrecision(
  value: number,
  maxDecimals: number,
  locale: string
): string {
  // Limit to 4-5 decimal places for numbers with digits before decimal point
  const decimalPlaces = Math.min(5, maxDecimals);

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
    useGrouping: true,
  }).format(value);

  return removeTrailingZeros(formatted);
}

/**
 * Standard formatting for normal range numbers
 */
function formatStandard(
  value: number,
  maxDecimals: number,
  locale: string,
  preserveTrailingZeros: boolean
): string {
  const absValue = Math.abs(value);

  // Handle based on leading zeros
  if (absValue < 1 && absValue > 0) {
    const leadingZeros = countLeadingZerosAfterDecimal(absValue);

    if (leadingZeros === 1) {
      // One leading zero: 6-7 significant figures
      return formatToSignificantFigures(value, 6);
    } else if (leadingZeros >= 2 && leadingZeros <= 4) {
      // 2-4 leading zeros: 4 significant figures
      return formatToSignificantFigures(value, 4);
    }
  }

  // Handle floating point precision issues
  const factor = Math.pow(10, maxDecimals);
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;

  // Determine optimal decimal places
  const decimalPlaces = preserveTrailingZeros
    ? maxDecimals
    : Math.min(maxDecimals, getSignificantDecimalPlaces(rounded));

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: preserveTrailingZeros ? decimalPlaces : 0,
    maximumFractionDigits: decimalPlaces,
    useGrouping: true,
  }).format(rounded);

  return preserveTrailingZeros ? formatted : removeTrailingZeros(formatted);
}

/**
 * Helper function to get significant decimal places (excluding trailing zeros)
 */
function getSignificantDecimalPlaces(value: number): number {
  const str = value.toString();
  if (!str.includes(".")) return 0;
  const decimal = str.split(".")[1];
  return decimal.replace(/0+$/, "").length;
}

/**
 * Helper function to remove trailing zeros and unnecessary decimal points
 */
function removeTrailingZeros(str: string): string {
  if (!str.includes(".")) return str;
  return str.replace(/\.?0+$/, "");
}

/**
 * Advanced formatter with automatic precision detection
 */
export const getSmartFormattedValue = (
  value: number,
  unitName = ""
): string => {
  if (!isFinite(value)) {
    if (isNaN(value)) return "Invalid";
    return value > 0 ? "∞" : "-∞";
  }

  const absValue = Math.abs(value);

  // Smart precision based on the new rules
  let maxDecimals: number;

  // Check for leading zeros pattern
  if (absValue < 1 && absValue > 0) {
    const leadingZeros = countLeadingZerosAfterDecimal(absValue);
    if (leadingZeros >= 5) {
      // Very long leading zeros - use scientific
      return getFormattedUnitValue(value, {
        useScientific: true,
        unitName,
        locale: "en-US",
      });
    }
  }

  // Default smart precision
  if (absValue >= 1000) maxDecimals = 2;
  else if (absValue >= 1) maxDecimals = 5; // Allow up to 5 decimal places
  else if (absValue >= 0.01) maxDecimals = 6;
  else if (absValue >= 0.000001) maxDecimals = 8;
  else maxDecimals = 12;

  return getFormattedUnitValue(value, {
    maxDecimals,
    unitName,
    locale: "en-US",
  });
};

// export const getFormattedUnitValue = (value: number) => {
//   // Handle non-finite values
//   if (!isFinite(value)) return "Invalid";

//   const absVal = Math.abs(value);
//   const valueStr = value.toString();

//   // Handle very small numbers with many leading zeros
//   if (absVal < 0.000001 && absVal !== 0) {
//     return value.toFixed(6).replace(/\.?0+$/, "");
//   }

//   // Handle large decimal precision
//   const decimalPart = valueStr.split(".")[1];
//   if (decimalPart && decimalPart.length > 14 && valueStr.startsWith("0.")) {
//     return value.toExponential(6).replace(/\.?0+e/, "e"); // Clean trailing zeros before "e"
//   }
//   if (decimalPart && decimalPart.length > 6) return value.toFixed(5);
//   // General formatting: commas + trim trailing zeros
//   const rounded = parseFloat(value.toFixed(12)); // Clean up float precision mess
//   return new Intl.NumberFormat("en-US", {
//     maximumFractionDigits: 12,
//   }).format(rounded);
// };
