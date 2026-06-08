import type { ConversionHistoryEntry } from "@/features/converters/conversionHistory";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

export const fetchHistory = async (
  fetchFunction: () => Promise<PostgrestSingleResponse<ConversionHistoryEntry[]>>,
) => {
  const response = await fetchFunction();
  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.data as ConversionHistoryEntry[];
};
