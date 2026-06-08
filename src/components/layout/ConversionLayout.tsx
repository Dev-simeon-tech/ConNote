import { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { addToConversionHistory } from "@/lib/supabase/supabaseClient";
import { convertersData } from "@/data/convertersData";
import { useIsMobile } from "@/hooks/use-mobile";
import useUser from "@/hooks/useUser";

import Dropdown from "../ui/dropdown";
import { ArrowUpDown } from "lucide-react";

import { getFormattedNumber } from "../../utils/getFormattedNumber.utils";
import { getFormattedUnitValue } from "../../utils/getFormattedUnitValue.utils";
import { getDynamicFontSize } from "../../utils/getDynamicFontSize";
import { getDynamicInputFontSize } from "../../utils/getDynamicFontSize";
import { Link, useLocation } from "react-router";

type ConversionLayoutPropType<T> = {
  title: string;
  unitsArr: T[];
  conversionFunc: (value: number, from: T, to: T) => number;
};
const ConversionLayout = <T,>({
  title,
  unitsArr,
  conversionFunc,
}: ConversionLayoutPropType<T>) => {
  const [fromUnit, setFromUnit] = useState(unitsArr[1]);
  const [toUnit, setToUnit] = useState(unitsArr[2]);
  const [convertedValue, setConvertedValue] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const { user } = useUser();
  const MAX_INPUT_LENGTH = 15;
  const location = useLocation();
  const currentPath = location.pathname.split("/")[2];
  const isMobile = useIsMobile();

  const dynamicResultSize = getDynamicFontSize(
    getFormattedUnitValue(convertedValue).length,
    isMobile,
  );
  const dynamicInputSize = getDynamicInputFontSize(
    getFormattedNumber(inputValue).length,
    isMobile,
  );

  useEffect(() => {
    if (inputValue === "") {
      setConvertedValue(0);
    }
  }, [inputValue]);

  useEffect(() => {
    if (
      inputValue === "" ||
      inputValue === "0." ||
      inputValue === "-" ||
      inputValue === "-0" ||
      inputValue === "."
    )
      return;

    const convertedValue = conversionFunc(
      parseFloat(inputValue),
      fromUnit,
      toUnit,
    );
    setConvertedValue(convertedValue);
  }, [inputValue, fromUnit, toUnit, conversionFunc]);

  const isSaved = useRef(false); // prevent double-saving

  const saveConversion = async () => {
    if (!inputValue || Number(inputValue) === 0 || isSaved.current) return;
    // Don't save if:

    if (fromUnit === toUnit) return; // converting a unit to itself
    if (Number(convertedValue) === Infinity) return; // division by zero edge case
    if (!user) return;
    isSaved.current = true;

    await addToConversionHistory(
      user?.id,
      title.split(" ")[0].toLocaleLowerCase(),
      String(fromUnit),
      String(toUnit),
      Number(inputValue),
      convertedValue,
    );
  };

  console.log();
  // Debounced version for while typing
  const debouncedSave = useDebouncedCallback(saveConversion, 2500);

  // Immediate save on blur in case debounce hasn't fired yet
  const handleBlur = () => {
    debouncedSave.flush(); // force the debounced function to fire immediately
  };

  const handleInputChange = (value: string) => {
    const rawValue = value.replace(/[^0-9.-]/g, "");
    const digits = rawValue.replace(/[^0-9]/g, "");
    if (digits.length > MAX_INPUT_LENGTH) return;

    isSaved.current = false;
    setInputValue(rawValue);
    debouncedSave();
  };

  return (
    <main className='bg-bg p-4 '>
      <div className='flex gap-2 flex-wrap '>
        {convertersData.map((converter, index) => (
          <Link to={`/converters/${converter.name.toLowerCase()}`} key={index}>
            <button
              key={index}
              className={`py-3 px-5  shadow-sm rounded-xl
                ${currentPath === converter.name.toLowerCase() ? "bg-primary text-white" : "bg-white text-text-body "}`}
            >
              {converter.name}
            </button>
          </Link>
        ))}
      </div>
      <section className=' lg:mt-10 mt-4 flex justify-center items-center h-full w-full'>
        <div className='bg-white rounded-3xl p-10 shadow-lg'>
          <article>
            <h2 className='md:text-3xl text-2xl text font-bold text-text-heading'>
              Convert {title}
            </h2>
            <p className='pt-4'>
              Precision measurement conversion with real- time architectural
              accuracy.
            </p>
          </article>

          <div className='flex flex-col justify-center gap-5 mt-10 '>
            {/* from unit */}
            <div>
              <p className='converter-label'>From Value</p>
              <div className='bg-surface p-8 rounded-2xl flex max-[37.5rem]:flex-col max-[37.5rem]:items-start  gap-3 justify-between items-center'>
                <input
                  type='text'
                  style={{ fontSize: dynamicInputSize }}
                  className={`bg-transparent p-2 placeholder:font-medium placeholder:text-base  border-1 rounded-sm focus-visible:outline-0 border-black text-xl w-full md:w-1/2 lg:text-2xl font-bold ${dynamicInputSize} `}
                  inputMode='numeric'
                  value={getFormattedNumber(inputValue)}
                  placeholder='Enter a value'
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
                <Dropdown
                  itemsArr={unitsArr}
                  currentItem={fromUnit}
                  renderItem={(unit, index) => (
                    <button
                      onClick={() => setFromUnit(unit)}
                      className={`unit-option px-2 py-1 relative hover:bg-border rounded-md ${
                        fromUnit === unit ? "active bg-border" : ""
                      }`}
                      key={index}
                    >
                      <p className='capitalize text-left'>{String(unit)}</p>
                    </button>
                  )}
                />
              </div>
            </div>

            <button
              onClick={() => {
                setFromUnit(toUnit);
                setToUnit(fromUnit);
                setIsRotated(!isRotated);
              }}
              className={`p-4 block mx-auto  hover:bg-primary-hover shadow-primary text-white w-fit rounded-lg bg-primary transition-transform duration-300 ${
                isRotated
                  ? "rotate-180 shadow-[0_-25px_50px_-12px]"
                  : "rotate-0 shadow-2xl"
              }`}
            >
              <ArrowUpDown />
            </button>

            {/* to unit */}
            <div>
              <p className='converter-label'>To Value</p>
              <div className='bg-surface p-8 rounded-2xl flex gap-3 max-[37.5rem]:flex-col max-[37.5rem]:items-start justify-between items-center'>
                <p
                  style={{ fontSize: dynamicResultSize }}
                  className='lg:text-3xl text-2xl text-primary font-bold '
                >
                  {getFormattedUnitValue(convertedValue)}
                </p>
                <Dropdown
                  itemsArr={unitsArr}
                  currentItem={toUnit}
                  renderItem={(unit, index) => (
                    <button
                      onClick={() => setToUnit(unit)}
                      className={`unit-option px-2 py-1 relative hover:bg-border rounded-md ${
                        toUnit === unit ? "active bg-border " : ""
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
      </section>
    </main>
  );
};

export default ConversionLayout;
