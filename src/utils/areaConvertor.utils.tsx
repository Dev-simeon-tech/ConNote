export type areaType =
  | "square millimeters"
  | "square centimeters"
  | "square meters"
  | "hectares"
  | "square kilometers"
  | "square inches"
  | "square feet"
  | "square yards"
  | "acres"
  | "square miles";

const areaUnitToMeter: Record<areaType, number> = {
  "square millimeters": 0.001,
  "square centimeters": 0.01,
  "square meters": 1,
  hectares: 100,
  "square kilometers": 1000,
  "square inches": 0.0254,
  "square feet": 0.3048,
  "square yards": 0.9144,
  acres: 63.6149,
  "square miles": 1609.344,
};

export const convertArea = (value: number, from: areaType, to: areaType) => {
  const fromToMeter = areaUnitToMeter[from];
  const toToMeter = areaUnitToMeter[to];
  // Square the conversion factors
  return (value * fromToMeter ** 2) / toToMeter ** 2;
  //      8          1     /    0.3048
};
