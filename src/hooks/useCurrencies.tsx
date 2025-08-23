import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../utils/fetchData.utils";

const apiKey = import.meta.env.VITE_CURRENCY_API_KEY;
const currencyListUrl = `https://api.currencyapi.com/v3/currencies?apikey=${apiKey}&currencies`;

const useCurrencies = () => {
  return useQuery({
    queryKey: ["currencies", { currencyListUrl }],
    queryFn: () => fetchData(currencyListUrl),
    staleTime: 1000 * 60 * 60, // 1hr
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export default useCurrencies;
