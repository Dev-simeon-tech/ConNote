import { useState, useEffect, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { getFormattedNumber } from "../../utils/getFormattedNumber.utils";
import { SidebarContext } from "../../context/sidebar.context";
import Spinner from "../../components/ui/spinner";
import Keypad from "../../components/ui/keypad";
import { getFormattedUnitValue } from "../../utils/getFormattedUnitValue.utils";
import { getDynamicFontSize } from "../../utils/getDynamicFontSize";
import { getDynamicInputFontSize } from "../../utils/getDynamicFontSize";
import { useClickOutside } from "../../hooks/useClickOutside";
import { fetchData } from "../../utils/fetchData.utils";
import { convertCurrency } from "../../utils/currencyConverter.utils";
import arrowIcon from "../../assets/arrow-up.svg";

const apiKey = import.meta.env.VITE_CURRENCY_API_KEY;

const currencyListUrl = `https://api.currencyapi.com/v3/currencies?apikey=${apiKey}&currencies`;
const ratesUrl = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}`;

const Currency = () => {
  const {
    data: rates,
    error: errorRates,
    isLoading: loadingRates,
  } = useQuery({
    queryKey: ["currencyRates", { ratesUrl }],
    queryFn: () => fetchData(ratesUrl),
    staleTime: 1000 * 60 * 10, // 10 minutes: keeps rates fresh but avoids spam fetching
    refetchOnMount: false, // Don't refetch if data is still in cache
    refetchOnWindowFocus: false, // Don't refetch just by switching tabs
    refetchInterval: false, // No polling unless you want live updating
  });

  const {
    data: currencies,
    error: errorCurrency,
    isLoading: loadingCurrency,
  } = useQuery({
    queryKey: ["currencies", { currencyListUrl }],
    queryFn: () => fetchData(currencyListUrl),
    staleTime: 1000 * 60 * 60, // 1hr
  });

  if (errorCurrency || errorRates) {
    console.error("Error fetching currency data:", errorCurrency || errorRates);
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
  const { toggleSidebar, isNavOpen, animateMenu } = useContext(SidebarContext);

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
    if (!fromCurrency && currenciesArray.length) {
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
  }, [inputCurrency, fromCurrency, toCurrency, currenciesArray]);

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

  if (loadingCurrency || loadingRates) {
    return <Spinner />;
  }
  return (
    <>
      <header className='flex h-[10vh] w-full items-center gap-4 p-4 '>
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
        <h2 className='text-3xl font-medium'>Currency</h2>
      </header>

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
          </div>
        </div>

        <Keypad setInput={setInputCurrency} input={inputCurrency} />
      </div>
    </>
  );
};

export default Currency;
