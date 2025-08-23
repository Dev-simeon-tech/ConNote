import ConversionLayout from "../../components/layout/ConversionLayout";
import type { LengthUnit } from "../../utils/lengthConvertor.utils";
import { convertLength } from "../../utils/lengthConvertor.utils";

const lengthUnits: LengthUnit[] = [
  "angstroms",
  "nanometers",
  "microns",
  "millimeters",
  "centimeters",
  "meters",
  "kilometers",
  "inches",
  "feet",
  "yards",
  "miles",
];

const Length = () => {
  return (
    <ConversionLayout
      title='Length'
      unitsArr={lengthUnits}
      conversionFunc={convertLength}
    />
  );
};

export default Length;
