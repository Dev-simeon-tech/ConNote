import { useState, useEffect, useMemo, useRef } from "react";
import { convertersData } from "@/data/convertersData";
import { Link, useLocation } from "react-router";
import { ArrowUpDown } from "lucide-react";
import Select, { type SingleValue } from "react-select";
import useCurrencies from "../../hooks/useCurrencies";
import useCurrencyRates from "../../hooks/useCurrencyRates";
import { useIsMobile } from "@/hooks/use-mobile";
import useUser from "@/hooks/useUser";
import { useUserConversionHistoryByCategory } from "@/hooks/useConversionHistory";

import AppSpinner from "@/components/app-spinner";

import Error from "../../components/ui/error";
import { Button } from "@/components/ui/button";

import { getFormattedNumber } from "../../utils/getFormattedNumber.utils";
import { getFormattedUnitValue } from "../../utils/getFormattedUnitValue.utils";
import { getDynamicFontSize } from "../../utils/getDynamicFontSize";
import { getDynamicInputFontSize } from "../../utils/getDynamicFontSize";
import { convertCurrency } from "../../utils/currencyConverter.utils";
import { useDebouncedCallback } from "use-debounce";
import { addToConversionHistory } from "@/lib/supabase/supabaseClient";
import { currencySelectStyles } from "@/styles/currencySelectStyles";

export type CurrencyOption = {
  value: string;
  label: string;
  code: string;
};

const Currency = () => {
  const {
    data: rates,
    error: errorRates,
    isLoading: loadingRates,
    isRefetching: refetchingRates,
    refetch: refetchRates,
  } = useCurrencyRates();

  const {
    data: currencies,
    error: errorCurrency,
    isLoading: loadingCurrency,
    isRefetchError: refetchingCurrency,
    refetch: refetchCurrencies,
  } = useCurrencies();

  const { data: previousConversion, isLoading: isPreviousConversionLoading } =
    useUserConversionHistoryByCategory("currency", 1);

  const refetchData = () => {
    refetchCurrencies();
    refetchRates();
  };

  const currenciesArray = useMemo(
    () =>
      currencies?.data
        ? Object.entries(currencies.data)
            .map(([, value]) => {
              const { name, code, symbol_native } = value as {
                name: string;
                code: string;
                symbol_native: string;
              };
              return { name, code, symbol_native };
            })
            .sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [currencies],
  );
  const currencyOptions = useMemo(
    () =>
      currenciesArray.map((currency) => ({
        value: currency.name,
        label: currency.name,
        code: currency.code,
      })),
    [currenciesArray],
  );
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [convertedCurrency, setConvertedCurrency] = useState<number>(0);
  const [inputCurrency, setInputCurrency] = useState("0");
  const [isRotated, setIsRotated] = useState(false);
  const { user } = useUser();
  const isSaved = useRef(false);
  const location = useLocation();
  const currentPath = location.pathname.split("/")[2];
  const isMobile = useIsMobile();
  const MAX_INPUT_LENGTH = 15;

  const dynamicResultSize = getDynamicFontSize(
    getFormattedUnitValue(convertedCurrency).length,
    isMobile,
  );
  const dynamicInputSize = getDynamicInputFontSize(
    getFormattedNumber(inputCurrency).length,
    isMobile,
  );

  useEffect(() => {
    if (previousConversion && previousConversion.length > 0) {
      setFromCurrency(previousConversion[0].from_unit);
      setToCurrency(previousConversion[0].to_unit);
    } else if (currenciesArray.length) {
      setFromCurrency(currenciesArray[2].name);
      setToCurrency(currenciesArray[8].name);
    }
  }, [currenciesArray, previousConversion]);

  useEffect(() => {
    if (inputCurrency === "" || inputCurrency === "0.") return;

    const fromCode = currenciesArray.find(
      (currencies) => currencies.name === fromCurrency,
    )?.code;
    const toCode = currenciesArray.find(
      (currencies) => currencies.name === toCurrency,
    )?.code;

    if (fromCode && toCode && rates) {
      const convertedValue = convertCurrency(
        parseFloat(inputCurrency),
        rates.data[fromCode].value,
        rates.data[toCode].value,
      );
      setConvertedCurrency(convertedValue);
    }
  }, [inputCurrency, fromCurrency, toCurrency, currenciesArray, rates]);

  useEffect(() => {
    if (inputCurrency === "") {
      setConvertedCurrency(0);
    }
  }, [inputCurrency]);

  const saveConversion = async () => {
    if (!inputCurrency || Number(inputCurrency) === 0 || isSaved.current)
      return;
    // Don't save if:

    if (fromCurrency === toCurrency) return; // converting a currency to itself
    if (Number(convertedCurrency) === Infinity) return; // division by zero edge case
    if (!user) return;
    isSaved.current = true;

    await addToConversionHistory(
      user?.id,
      "currency",
      String(fromCurrency),
      String(toCurrency),
      Number(inputCurrency),
      convertedCurrency,
    );
  };

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
    setInputCurrency(rawValue);
    debouncedSave();
  };

  const handleFromCurrencyChange = (option: SingleValue<CurrencyOption>) => {
    if (option) setFromCurrency(option.value);
  };

  const handleToCurrencyChange = (option: SingleValue<CurrencyOption>) => {
    if (option) setToCurrency(option.value);
  };

  const formatCurrencyOption = (option: CurrencyOption) => (
    <div className='flex flex-col text-left'>
      <span className='capitalize'>{option.label}</span>
      <span className='text-[10px]'>{option.code}</span>
    </div>
  );

  if (errorCurrency || errorRates) {
    return (
      <Error>
        <h2 className='text-3xl'>Something went wrong!</h2>
        <Button onClick={() => refetchData()}>Refetch</Button>
      </Error>
    );
  }

  if (
    loadingCurrency ||
    loadingRates ||
    refetchingRates ||
    refetchingCurrency ||
    isPreviousConversionLoading
  ) {
    return <AppSpinner />;
  }
  return (
    <main className='bg-bg p-4 overflow-y-auto pb-10 '>
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
              Convert Currency
            </h2>
            <p className='pt-4'>
              Explore live exchange rates and global currency with precision.
            </p>
          </article>

          <div className='flex flex-col justify-center gap-5 mt-10 '>
            {/* from unit */}
            <div>
              <p className='converter-label'>From Currency</p>
              <div className='bg-surface p-8 rounded-2xl flex max-[37.5rem]:flex-col  gap-3 justify-between items-center'>
                <div className='flex border-1 pl-1 border-black rounded-sm items-center md:w-[50%] gap-1 bg-transparent '>
                  <span className='text-2xl  font-extralight pr-2 '>
                    {
                      currenciesArray[
                        currenciesArray.findIndex(
                          (currencies) => currencies.name === fromCurrency,
                        )
                      ]?.symbol_native
                    }
                  </span>
                  <input
                    type='text'
                    style={{ fontSize: dynamicInputSize }}
                    className={`bg-transparent p-2 placeholder:font-medium placeholder:text-base  border-none rounded-sm focus-visible:outline-0 h-full text-xl w-full  lg:text-2xl font-bold ${dynamicInputSize} `}
                    inputMode='numeric'
                    value={getFormattedNumber(inputCurrency)}
                    placeholder='Enter a value'
                    onBlur={handleBlur}
                    onChange={(e) => handleInputChange(e.target.value)}
                  />
                </div>
                <Select
                  className='w-full md:w-[220px]'
                  styles={currencySelectStyles}
                  options={currencyOptions}
                  value={
                    currencyOptions.find(
                      (currency) => currency.value === fromCurrency,
                    ) ?? null
                  }
                  onChange={handleFromCurrencyChange}
                  formatOptionLabel={formatCurrencyOption}
                  isSearchable
                />
              </div>
            </div>

            <button
              onClick={() => {
                setFromCurrency(toCurrency);
                setToCurrency(fromCurrency);
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
              <p className='converter-label'>To Currency</p>
              <div className='bg-surface p-8 rounded-2xl flex gap-3 max-[37.5rem]:flex-col  justify-between items-center'>
                <div className='flex items-center'>
                  <span className='text-2xl font-extralight pr-2'>
                    {
                      currenciesArray[
                        currenciesArray.findIndex(
                          (currencies) => currencies.name === toCurrency,
                        )
                      ]?.symbol_native
                    }
                  </span>
                  <p
                    style={{ fontSize: dynamicResultSize }}
                    className='lg:text-3xl  text-primary font-bold '
                  >
                    {getFormattedUnitValue(convertedCurrency)}
                  </p>
                </div>
                <Select
                  className='w-full md:w-[220px]'
                  styles={currencySelectStyles}
                  options={currencyOptions}
                  value={
                    currencyOptions.find(
                      (currency) => currency.value === toCurrency,
                    ) ?? null
                  }
                  onChange={handleToCurrencyChange}
                  formatOptionLabel={formatCurrencyOption}
                  isSearchable
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Currency;
