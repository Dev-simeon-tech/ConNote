export type TemperatureType = "celsius" | "fahrenheit" | "kelvin";

export const convertTemp = (
  value: number,
  from: TemperatureType,
  to: TemperatureType
): number => {
  let convertedTemp: number = value;
  if (to === "celsius" && from === "kelvin") {
    convertedTemp = value - 273.15;
  } else if (to === "celsius" && from === "fahrenheit") {
    convertedTemp = ((value - 32) * 5) / 9;
  } else if (to === "fahrenheit" && from === "celsius") {
    convertedTemp = (value * 9) / 5 + 32;
  } else if (to === "fahrenheit" && from === "kelvin") {
    convertedTemp = ((value - 273.15) * 9) / 5 + 32;
  } else if (to === "kelvin" && from === "celsius") {
    convertedTemp = value + 273.15;
  } else if (to === "kelvin" && from === "fahrenheit") {
    convertedTemp = ((value - 32) * 5) / 9 + 273.15;
  }

  return convertedTemp;
};
