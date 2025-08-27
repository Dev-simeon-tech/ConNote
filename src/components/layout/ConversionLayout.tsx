import { useState, useEffect } from "react";

import MenuButton from "../ui/menuButton";
import Keypad from "../ui/keypad";
import Dropdown from "../ui/dropdown";

import { getFormattedNumber } from "../../utils/getFormattedNumber.utils";
import { getFormattedUnitValue } from "../../utils/getFormattedUnitValue.utils";
import { getDynamicFontSize } from "../../utils/getDynamicFontSize";
import { getDynamicInputFontSize } from "../../utils/getDynamicFontSize";

type ConversionLayoutPropType<T> = {
  title: string;
  unitsArr: T[];
  conversionFunc: (value: number, from: T, to: T) => number;
  keypadType?: string;
};
const ConversionLayout = <T,>({
  title,
  unitsArr,
  conversionFunc,
  keypadType,
}: ConversionLayoutPropType<T>) => {
  const [fromUnit, setFromUnit] = useState(unitsArr[1]);
  const [toUnit, setToUnit] = useState(unitsArr[2]);
  const [convertedUnit, setConvertedUnit] = useState<number>(0);
  const [inputUnit, setInputUnit] = useState("0");

  const dynamicResultSize = getDynamicFontSize(
    getFormattedUnitValue(convertedUnit).length
  );
  const dynamicInputSize = getDynamicInputFontSize(
    getFormattedNumber(inputUnit).length
  );

  useEffect(() => {
    if (inputUnit === "" || inputUnit === "0.") return;

    const convertedValue = conversionFunc(
      parseFloat(inputUnit),
      fromUnit,
      toUnit
    );
    setConvertedUnit(convertedValue);
  }, [inputUnit, fromUnit, toUnit]);

  return (
    <>
      <header className='flex h-[10vh] w-full items-center top-0 gap-4 p-4 '>
        <MenuButton />
        <h2 className='text-3xl font-medium'>{title}</h2>
      </header>

      <h3 className='lg:ml-15 ml-4 mt-5 text-xl'>
        <strong>instruction: </strong> Click on the Keypad to input values
      </h3>

      <div className='flex h-[90vh] flex-col lg:flex-row lg:items-center justify-between'>
        <div className='p-4 lg:px-10 flex lg:h-full lg:items-center'>
          <div className='flex flex-col lg:gap-25 '>
            <div>
              <p
                style={{ fontSize: dynamicInputSize }}
                className=' input-field font-bold'
              >
                {getFormattedNumber(inputUnit)}
              </p>
              <div className='relative w-fit flex flex-col gap-4'>
                <Dropdown
                  itemsArr={unitsArr}
                  currentItem={fromUnit}
                  renderItem={(unit, index) => (
                    <button
                      onClick={() => setFromUnit(unit)}
                      className={`unit-option px-2 py-1 relative hover:bg-dark-gray rounded-md ${
                        fromUnit === unit ? "active bg-dark-gray" : ""
                      }`}
                      key={index}
                    >
                      <p className='capitalize text-left'>{String(unit)}</p>
                    </button>
                  )}
                />
              </div>
            </div>
            <div>
              <p
                style={{ fontSize: dynamicResultSize }}
                className=' font-Inter font-extralight'
              >
                {getFormattedUnitValue(convertedUnit)}
              </p>
              <div className='unit-dropdown w-fit relative flex flex-col gap-4'>
                <Dropdown
                  itemsArr={unitsArr}
                  currentItem={toUnit}
                  renderItem={(unit, index) => (
                    <button
                      onClick={() => setToUnit(unit)}
                      className={`unit-option px-2 py-1 relative hover:bg-dark-gray rounded-md ${
                        toUnit === unit ? "active bg-dark-gray" : ""
                      }`}
                      key={index}
                    >
                      <p className='capitalize text-left'>{String(unit)}</p>
                    </button>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <Keypad
          keypadtype={keypadType}
          setInput={setInputUnit}
          input={inputUnit}
        />
      </div>
    </>
  );
};

export default ConversionLayout;
