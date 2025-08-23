export const getFormattedNumber = (value: string) => {
  const hasTrailingDot = value.endsWith(".");
  const hasLeadingDot = value.startsWith(".");

  // Prevent formatting if not parsable
  if (value === "" || value === ".") return value;

  let number = parseFloat(value);
  let formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 20,
  }).format(number);

  // Restore decimal if user is mid-typing
  if (hasTrailingDot) formatted += ".";
  if (value.endsWith(".0")) formatted += ".0";
  if (hasLeadingDot && !formatted.startsWith("0")) formatted = "0" + formatted;

  return formatted;
};
