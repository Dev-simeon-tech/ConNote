import { useQuery } from "@tanstack/react-query";
import useUser from "@/hooks/useUser";
import type { ConversionHistoryEntry } from "@/features/converters/conversionHistory";
import { fetchHistory } from "@/utils/fetchConversionHistory";
import {
  getUserConversionHistory,
  getUserConversionHistoryByCategory,
} from "@/lib/supabase/supabaseClient";

export const useConversonHistory = () => {
  const { user } = useUser();
  return useQuery<ConversionHistoryEntry[], Error>({
    queryKey: ["conversionHistory", user?.id],
    queryFn: () => fetchHistory(async () => getUserConversionHistory(user!.id)),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useUserConversionHistoryByCategory = (
  category: string,
  limit: number = 10,
) => {
  const { user } = useUser();
  return useQuery<ConversionHistoryEntry[], Error>({
    queryKey: ["conversionHistory", user?.id, category],
    queryFn: () =>
      fetchHistory(async () =>
        getUserConversionHistoryByCategory(user!.id, category, limit),
      ),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};
