export type WeightType =
  | "carats"
  | "milligrams"
  | "centigrams"
  | "decigrams"
  | "grams"
  | "dekagrams"
  | "hectograms"
  | "kilograms"
  | "metric Tonne"
  | "ounces"
  | "pounds";

const toGrams: Record<WeightType, number> = {
  carats: 0.2,
  milligrams: 0.001,
  centigrams: 0.01,
  decigrams: 0.1,
  grams: 1,
  dekagrams: 10,
  hectograms: 100,
  kilograms: 1000,
  "metric Tonne": 1000000,
  ounces: 28.34952,
  pounds: 453.5924,
};

export const convertWeight = (
  value: number,
  from: WeightType,
  to: WeightType
): number => {
  const inMeters = value * toGrams[from];
  return inMeters / toGrams[to];
};
