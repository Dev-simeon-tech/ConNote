import type { WeightType } from "../../utils/weightConvertor.utils";
import ConversionLayout from "../../components/layout/ConversionLayout";
import { convertWeight } from "../../utils/weightConvertor.utils";

const WeightUnits: WeightType[] = [
  "carats",
  "milligrams",
  "centigrams",
  "decigrams",
  "grams",
  "dekagrams",
  "hectograms",
  "kilograms",
  "metric Tonne",
  "ounces",
  "pounds",
];

const Weight = () => {
  return (
    <div>
      <ConversionLayout
        title='Weight and Mass'
        unitsArr={WeightUnits}
        conversionFunc={convertWeight}
      />
    </div>
  );
};

export default Weight;
