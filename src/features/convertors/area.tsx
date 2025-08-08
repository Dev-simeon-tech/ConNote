import ConversionLayout from "../../components/ui/ConversionLayout";
import { convertArea } from "../../utils/areaConvertor.utils";
import type { areaType } from "../../utils/areaConvertor.utils";

const areaUnits: areaType[] = [
  "square millimeters",
  "square centimeters",
  "square meters",
  "hectares",
  "square kilometers",
  "square inches",
  "square feet",
  "square yards",
  "acres",
  "square miles",
];

const Area = () => {
  return (
    <ConversionLayout
      title='Area'
      unitsArr={areaUnits}
      conversionFunc={convertArea}
    />
  );
};

export default Area;
