import ConversionLayout from "../ui/ConversionLayout";
import type { TemperatureType } from "../../utils/temperatureConvertor.utils";
import { convertTemp } from "../../utils/temperatureConvertor.utils";

const temperatureUnits: TemperatureType[] = ["celsius", "fahrenheit", "kelvin"];

const Temperature = () => {
  return (
    <ConversionLayout
      title='Temperature'
      unitsArr={temperatureUnits}
      conversionFunc={convertTemp}
      keypadType='temperature'
    />
  );
};

export default Temperature;
