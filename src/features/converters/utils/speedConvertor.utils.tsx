export type speedType =
  | "centimeters per second"
  | "meters per second"
  | "kilometers per hour"
  | "feet per second"
  | "miles per hour"
  | "knots"
  | "mach";

const speedUnitToMetersPerSecond = {
  "centimeters per second": 0.01, // 1 cm/s = 0.01 m/s
  "meters per second": 1, // base unit
  "kilometers per hour": 1 / 3.6, // 1 km/h = 0.2777778 m/s
  "feet per second": 0.3048, // 1 ft/s = 0.3048 m/s
  "miles per hour": 0.44704, // 1 mile/h = 0.44704 m/s
  knots: 0.514444, // 1 knot = 0.514444 m/s
  mach: 340.29, // Mach 1 at sea level ≈ 340.29 m/s
};

export const convertSpeed = (
  value: number,
  from: speedType,
  to: speedType
): number => {
  const fromToBase = speedUnitToMetersPerSecond[from];
  const toToBase = speedUnitToMetersPerSecond[to];

  return (value * fromToBase) / toToBase;
};
