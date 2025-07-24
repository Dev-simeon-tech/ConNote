import { useState, useEffect, useContext } from "react";

import { getFormattedNumber } from "../../utils/getFormattedNumber.utils";
import arrowIcon from "../../assets/arrow-up.svg";
import { SidebarContext } from "../../context/sidebar.context";
import Keypad from "../ui/keypad";
import { getFormattedUnitValue } from "../../utils/getFormattedUnitValue.utils";
import { getDynamicFontSize } from "../../utils/getDynamicFontSize";
import { getDynamicInputFontSize } from "../../utils/getDynamicFontSize";
import { useClickOutside } from "../../hooks/useClickOutside";

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
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);
  const [isDropdown2Open, setIsDropdown2Open] = useState(false);
  const { toggleSidebar, isNavOpen, animateMenu } = useContext(SidebarContext);

  const dynamicResultSize = getDynamicFontSize(
    getFormattedUnitValue(convertedUnit).length
  );
  const dynamicInputSize = getDynamicInputFontSize(
    getFormattedNumber(inputUnit).length
  );

  useClickOutside(".unit-dropdown", () => {
    setIsDropdown1Open(false);
    setIsDropdown2Open(false);
  });

  useEffect(() => {
    if (inputUnit === "" || inputUnit === "0.") return;

    const convertedValue = conversionFunc(
      parseFloat(inputUnit),
      fromUnit,
      toUnit
    );
    setConvertedUnit(convertedValue);
  }, [inputUnit, fromUnit, toUnit]);

  const toggleDropdown1 = () => {
    setIsDropdown1Open(!isDropdown1Open);
    setIsDropdown2Open(false);
  };
  const toggleDropdown2 = () => {
    setIsDropdown2Open(!isDropdown2Open);
    setIsDropdown1Open(false);
  };

  const fromUnitChangeHandler = (unit: T) => {
    setFromUnit(unit);
    setIsDropdown1Open(false);
  };

  const toUnitChangeHandler = (unit: T) => {
    setToUnit(unit);
    setIsDropdown2Open(false);
  };
  return (
    <>
      <header className='flex h-[10vh] w-full items-center top-0 gap-4 p-4 '>
        <button
          className={`w-8 h-8 z-40 ${
            isNavOpen ? "bg-white" : ""
          } p-1  flex flex-col gap-1 rounded-sm items-center justify-center`}
          onClick={toggleSidebar}
          aria-controls='sidebar-navigation'
          aria-expanded={isNavOpen}
        >
          <span className='sr-only'>Toggle sidebar navigation</span>

          {[0, 1, 2].map((__, index) => (
            <div
              key={index}
              className={`bg-black transition-all rounded-2xl duration-150  h-0.75 ${
                animateMenu ? "w-3" : "w-6"
              }`}
            ></div>
          ))}
        </button>
        <h2 className='text-3xl font-medium'>{title}</h2>
      </header>

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
              <div className='relative w-fit unit-dropdown flex flex-col gap-4'>
                <button
                  onClick={toggleDropdown1}
                  className='flex gap-2 items-center'
                >
                  <p className='capitalize text-xl'>{String(fromUnit)}</p>
                  <img src={arrowIcon} alt='arrow icon' />
                </button>
                <div
                  role='listbox'
                  aria-expanded={isDropdown1Open}
                  className={`flex bg-gray z-20 w-fit rounded-md gap-1 -top-1/2 -translate-y-1/2 transition-all flex-col absolute ${
                    isDropdown1Open
                      ? "max-h-[25rem] overflow-y-auto p-1"
                      : "max-h-0 overflow-y-hidden"
                  }`}
                >
                  {unitsArr.map((unit, index) => (
                    <button
                      onClick={() => fromUnitChangeHandler(unit)}
                      className={`unit-option px-2 py-1 relative hover:bg-dark-gray rounded-md ${
                        fromUnit === unit ? "active bg-dark-gray" : ""
                      }`}
                      key={index}
                    >
                      <p className='capitalize text-left'>{String(unit)}</p>
                    </button>
                  ))}
                </div>
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
                <button
                  onClick={toggleDropdown2}
                  className='flex gap-2 items-center'
                >
                  <p className='capitalize text-xl'>{String(toUnit)}</p>
                  <img src={arrowIcon} alt='arrow icon' />
                </button>
                <div
                  role='listbox'
                  aria-expanded={isDropdown2Open}
                  className={`flex bg-gray rounded-md gap-1 w-fit -top-1/2 -translate-y-1/2  transition-all flex-col absolute ${
                    isDropdown2Open
                      ? "max-h-[25rem] overflow-y-auto p-1"
                      : "max-h-0 overflow-y-hidden"
                  }`}
                >
                  {unitsArr.map((unit, index) => (
                    <button
                      onClick={() => toUnitChangeHandler(unit)}
                      className={`unit-option px-2 py-1 relative hover:bg-dark-gray rounded-md ${
                        toUnit === unit ? "active bg-dark-gray" : ""
                      }`}
                      key={index}
                    >
                      <p className='capitalize text-left'>{String(unit)}</p>
                    </button>
                  ))}
                </div>
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
