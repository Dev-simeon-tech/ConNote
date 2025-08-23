import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../utils/fetchData.utils";

const apiKey = import.meta.env.VITE_CURRENCY_API_KEY;
const ratesUrl = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}`;

const useCurrencyRates = () => {
  return useQuery({
    queryKey: ["currencyRates", { ratesUrl }],
    queryFn: () => fetchData(ratesUrl),
    staleTime: 1000 * 60 * 10, // 10 minutes: keeps rates fresh but avoids spam fetching
    refetchOnMount: false, // Don't refetch if data is still in cache
    refetchOnWindowFocus: false, // Don't refetch just by switching tabs
    refetchInterval: false, // No polling unless you want live updating
  });
};

export default useCurrencyRates;
