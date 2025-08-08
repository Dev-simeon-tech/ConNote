import type { speedType } from "../../utils/speedConvertor.utils";
import ConversionLayout from "../../components/ui/ConversionLayout";
import { convertSpeed } from "../../utils/speedConvertor.utils";

const speedUnits: speedType[] = [
  "centimeters per second",
  "meters per second",
  "kilometers per hour",
  "feet per second",
  "miles per hour",
  "knots",
  "mach",
];

const Speed = () => {
  return (
    <ConversionLayout
      title='Speed'
      unitsArr={speedUnits}
      conversionFunc={convertSpeed}
    />
  );
};

export default Speed;
