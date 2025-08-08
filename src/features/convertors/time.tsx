import type { timeType } from "../../utils/timeConvertor.utils";
import { convertTime } from "../../utils/timeConvertor.utils";
import ConversionLayout from "../../components/ui/ConversionLayout";

const timeUnits: timeType[] = [
  "Microseconds",
  "Milliseconds",
  "Seconds",
  "Minutes",
  "Hours",
  "Days",
  "Weeks",
  "Years",
];

const Time = () => {
  return (
    <ConversionLayout
      title='Time'
      unitsArr={timeUnits}
      conversionFunc={convertTime}
    />
  );
};

export default Time;
