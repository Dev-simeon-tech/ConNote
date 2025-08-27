import { useState, useEffect, useMemo } from "react";

import useCurrencies from "../../hooks/useCurrencies";
import useCurrencyRates from "../../hooks/useCurrencyRates";

import Spinner from "../../components/ui/spinner";
import MenuButton from "../../components/ui/menuButton";
import Keypad from "../../components/ui/keypad";
import Error from "../../components/ui/error";
import Button from "../../components/ui/button";
import Dropdown from "../../components/ui/dropdown";

import { getFormattedNumber } from "../../utils/getFormattedNumber.utils";
import { getFormattedUnitValue } from "../../utils/getFormattedUnitValue.utils";
import { getDynamicFontSize } from "../../utils/getDynamicFontSize";
import { getDynamicInputFontSize } from "../../utils/getDynamicFontSize";
import { convertCurrency } from "../../utils/currencyConverter.utils";

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

  const refetchData = () => {
    refetchCurrencies();
    refetchRates();
  };

  if (errorCurrency || errorRates) {
    return (
      <Error>
        <h2 className='text-3xl'>Something went wrong!</h2>
        <Button onClick={() => refetchData()}>Refetch</Button>
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

  const dynamicResultSize = getDynamicFontSize(
    getFormattedUnitValue(convertedCurrency).length
  );
  const dynamicInputSize = getDynamicInputFontSize(
    getFormattedNumber(inputCurrency).length
  );

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
                <Dropdown
                  itemsArr={currenciesArray.map((currency) => currency.name)}
                  currentItem={fromCurrency}
                  renderItem={(currency, index) => (
                    <button
                      onClick={() => setFromCurrency(currency)}
                      className={`unit-option px-2 py-1 relative hover:bg-dark-gray rounded-md ${
                        fromCurrency === currency ? "active bg-dark-gray" : ""
                      }`}
                      key={index}
                    >
                      <p className='capitalize text-left'>{String(currency)}</p>
                    </button>
                  )}
                />
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
              <div className='w-full relative flex flex-col gap-4'>
                <Dropdown
                  itemsArr={currenciesArray.map((currency) => currency.name)}
                  currentItem={toCurrency}
                  renderItem={(currency, index) => (
                    <button
                      onClick={() => setToCurrency(currency)}
                      className={`unit-option px-2 py-1 relative hover:bg-dark-gray rounded-md ${
                        toCurrency === currency ? "active bg-dark-gray" : ""
                      }`}
                      key={index}
                    >
                      <p className='capitalize text-left'>{String(currency)}</p>
                    </button>
                  )}
                />
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
