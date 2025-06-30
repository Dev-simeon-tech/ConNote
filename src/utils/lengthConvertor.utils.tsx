export type LengthUnit =
  | "angstroms"
  | "nanometers"
  | "microns"
  | "millimeters"
  | "centimeters"
  | "meters"
  | "kilometers"
  | "inches"
  | "feet"
  | "yards"
  | "miles";

const toMeters: Record<LengthUnit, number> = {
  nanometers: 1e-9,
  millimeters: 0.001,
  angstroms: 1e-10,
  centimeters: 0.01,
  meters: 1,
  kilometers: 1000,
  inches: 0.0254,
  feet: 0.3048,
  yards: 0.9144,
  miles: 1609.344,
  microns: 1e-6, // Added microns for completeness
};

export const convertLength = (
  value: number,
  from: LengthUnit,
  to: LengthUnit
): number => {
  const inMeters = value * toMeters[from];
  return inMeters / toMeters[to];
};
