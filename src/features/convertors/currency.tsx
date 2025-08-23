import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import useCurrencies from "../../hooks/useCurrencies";
import useCurrencyRates from "../../hooks/useCurrencyRates";
import { useClickOutside } from "../../hooks/useClickOutside";

import Spinner from "../../components/ui/spinner";
import MenuButton from "../../components/ui/menuButton";
import Keypad from "../../components/ui/keypad";
import Error from "../../components/ui/error";
import Button from "../../components/ui/button";

import { getFormattedNumber } from "../../utils/getFormattedNumber.utils";
import { getFormattedUnitValue } from "../../utils/getFormattedUnitValue.utils";
import { getDynamicFontSize } from "../../utils/getDynamicFontSize";
import { getDynamicInputFontSize } from "../../utils/getDynamicFontSize";
import { convertCurrency } from "../../utils/currencyConverter.utils";

import arrowIcon from "../../assets/arrow-up.svg";

const Currency = () => {
  const queryClient = useQueryClient();
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

  if (errorCurrency || errorRates) {
    return (
      <Error>
        <h2 className='text-3xl'>Something went wrong!</h2>
        <Button
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ["currencyRates", "currencies"],
            })
          }
        >
          Refetch
        </Button>
      </Error>
    );
  }
  const currenciesArray = useMemo(
    () =>
      currencies?.data
        ? Object.entries(currencies.data)
            .map(([__, value]) => {
              const { name, code, symbol_native } = value as {
                name: string;
                code: string;
                symbol_native: string;
              };
              return { name, code, symbol_native };
            })
            .sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [currencies]
  );
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [convertedCurrency, setConvertedCurrency] = useState<number>(0);
  const [inputCurrency, setInputCurrency] = useState("0");
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);
  const [isDropdown2Open, setIsDropdown2Open] = useState(false);

  const dynamicResultSize = getDynamicFontSize(
    getFormattedUnitValue(convertedCurrency).length
  );
  const dynamicInputSize = getDynamicInputFontSize(
    getFormattedNumber(inputCurrency).length
  );

  useClickOutside(".unit-dropdown", () => {
    setIsDropdown1Open(false);
    setIsDropdown2Open(false);
  });
  useEffect(() => {
    if (currenciesArray.length) {
      setFromCurrency(currenciesArray[2].name);
      setToCurrency(currenciesArray[8].name);
    }
  }, [currenciesArray]);

  useEffect(() => {
    if (inputCurrency === "" || inputCurrency === "0.") return;

    const fromCode = currenciesArray.find(
      (currencies) => currencies.name === fromCurrency
    )?.code;
    const toCode = currenciesArray.find(
      (currencies) => currencies.name === toCurrency
    )?.code;

    if (fromCode && toCode) {
      const convertedValue = convertCurrency(
        parseFloat(inputCurrency),
        rates.data[fromCode].value,
        rates.data[toCode].value
      );
      setConvertedCurrency(convertedValue);
    }
  }, [inputCurrency, fromCurrency, toCurrency, currenciesArray, rates]);

  const toggleDropdown1 = () => {
    setIsDropdown1Open(!isDropdown1Open);
    setIsDropdown2Open(false);
  };
  const toggleDropdown2 = () => {
    setIsDropdown2Open(!isDropdown2Open);
    setIsDropdown1Open(false);
  };

  const fromCurrencyChangeHandler = (currency: string) => {
    setFromCurrency(currency);
    setIsDropdown1Open(false);
  };

  const toCurrencyChangeHandler = (currency: string) => {
    setToCurrency(currency);
    setIsDropdown2Open(false);
  };
  const refetchData = () => {
    refetchCurrencies();
    refetchRates();
  };

  if (
    loadingCurrency ||
    loadingRates ||
    refetchingRates ||
    refetchingCurrency
  ) {
    return <Spinner />;
  }
  return (
    <>
      <header className='flex h-[10vh] w-full items-center gap-4 p-4 '>
        <MenuButton />
        <h2 className='text-3xl font-medium'>Currency</h2>
      </header>

      <h3 className='lg:ml-15 ml-4 mt-5 text-xl'>
        <strong>instruction: </strong> Click on the Keypad to input values
      </h3>

      <div className='flex h-[90vh] flex-col lg:flex-row lg:items-center justify-between'>
        <div className='p-4 lg:px-10 flex lg:h-full lg:items-center'>
          <div className='flex flex-col lg:gap-25 '>
            <div>
              <span className='text-4xl font-extralight pr-2'>
                {
                  currenciesArray[
                    currenciesArray.findIndex(
                      (currencies) => currencies.name === fromCurrency
                    )
                  ]?.symbol_native
                }
              </span>
              <p
                style={{ fontSize: dynamicInputSize }}
                className=' input-field inline font-bold'
              >
                {getFormattedNumber(inputCurrency)}
              </p>
              <div className='relative lg:w-[16rem] w-full unit-dropdown flex flex-col gap-4'>
                <button
                  onClick={toggleDropdown1}
                  className='flex gap-2 items-center'
                >
                  <p className='capitalize text-xl'>{String(fromCurrency)}</p>
                  <img src={arrowIcon} alt='arrow icon' />
                </button>
                <div
                  role='listbox'
                  aria-expanded={isDropdown1Open}
                  className={`flex bg-gray z-50 w-full rounded-md gap-1 -top-1/2 -translate-y-1/2 transition-all flex-col absolute ${
                    isDropdown1Open
                      ? "max-h-[25rem] overflow-y-auto p-1"
                      : "max-h-0 overflow-y-hidden"
                  }`}
                >
                  {currenciesArray.map((currency, index) => (
                    <button
                      onClick={() => fromCurrencyChangeHandler(currency.name)}
                      className={`unit-option px-2 py-1 relative hover:bg-dark-gray rounded-md ${
                        fromCurrency === currency.name
                          ? "active bg-dark-gray"
                          : ""
                      }`}
                      key={index}
                    >
                      <p className='capitalize text-left'>
                        {String(currency.name)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <span className='text-4xl font-extralight pr-2'>
                {
                  currenciesArray[
                    currenciesArray.findIndex(
                      (currencies) => currencies.name === toCurrency
                    )
                  ]?.symbol_native
                }
              </span>
              <p
                style={{ fontSize: dynamicResultSize }}
                className=' font-Inter inline font-extralight'
              >
                {new Intl.NumberFormat("en-US").format(convertedCurrency)}
              </p>
              <div className='unit-dropdown w-full relative flex flex-col gap-4'>
                <button
                  onClick={toggleDropdown2}
                  className='flex gap-2 items-center'
                >
                  <p className='capitalize text-xl'>{String(toCurrency)}</p>
                  <img src={arrowIcon} alt='arrow icon' />
                </button>
                <div
                  role='listbox'
                  aria-expanded={isDropdown2Open}
                  className={`flex bg-gray rounded-md gap-1 w-full lg:w-[16rem] -top-1/2 -translate-y-1/2  transition-all flex-col absolute ${
                    isDropdown2Open
                      ? "max-h-[25rem] overflow-y-auto p-1"
                      : "max-h-0 overflow-y-hidden"
                  }`}
                >
                  {currenciesArray.map((currency, index) => (
                    <button
                      onClick={() => toCurrencyChangeHandler(currency.name)}
                      className={`unit-option px-2 py-1 relative hover:bg-dark-gray rounded-md ${
                        toCurrency === currency.name
                          ? "active bg-dark-gray"
                          : ""
                      }`}
                      key={index}
                    >
                      <p className='capitalize text-left'>
                        {String(currency.name)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={refetchData} className='text-light-green w-fit'>
              Update rates
            </button>
          </div>
        </div>

        <Keypad setInput={setInputCurrency} input={inputCurrency} />
      </div>
    </>
  );
};

export default Currency;
