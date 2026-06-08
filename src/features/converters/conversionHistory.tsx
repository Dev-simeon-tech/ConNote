import { RefreshCw, Loader2, Trash2, ScrollText } from "lucide-react";
import { deleteConversionHistory } from "@/lib/supabase/supabaseClient";
import { converterColorSelector } from "@/utils/convertersColorSelector";

import useUser from "@/hooks/useUser";
import { useConversonHistory } from "@/hooks/useConversionHistory";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  DataTableContent,
  DataTableTable,
  DataTableHeaderRow,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableCell,
} from "@/components/ui/data-table";

export type ConversionHistoryEntry = {
  id: string;
  user_id: string;
  category: string;
  from_unit: string;
  to_unit: string;
  input_value: number;
  output_value: number;
  converted_at: string | null;
};

const ConversionHistory = () => {
  const { user } = useUser();

  const {
    data: history,
    isLoading,
    isError,
    error,
    refetch,
  } = useConversonHistory();

  if (!user) {
    return (
      <div className='px-6 py-8 sm:px-10'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl!'>Conversion History</CardTitle>
            <CardDescription>
              Sign in to see your saved conversion history from Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='rounded-3xl border border-border/70 bg-muted p-8 text-center text-sm text-muted-foreground'>
              You need to be logged in to view your conversion history.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='px-6 py-8 sm:px-10'>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent conversions</CardTitle>
            <CardDescription>
              Every conversion is saved for your signed-in account with the
              newest items first.
            </CardDescription>
          </div>
          <CardAction>
            <Button
              variant='outline'
              size='sm'
              onClick={() => void refetch()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <RefreshCw className='mr-2 h-4 w-4' />
              )}
              Refresh
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <DataTable>
            <DataTableContent>
              {isLoading ? (
                <div className='flex min-h-[240px] items-center justify-center px-6 py-24 text-sm text-muted-foreground'>
                  Loading history...
                </div>
              ) : isError ? (
                <div className='flex min-h-[240px] items-center justify-center px-6 py-24 text-sm text-destructive'>
                  {error?.message || "Unable to load your conversion history."}
                </div>
              ) : !history || history.length === 0 ? (
                <div className='flex min-h-[240px] gap-2 flex-col items-center justify-center px-6 py-24 text-sm text-muted-foreground'>
                  <ScrollText size={40} />
                  <p>
                    No conversion history found. Perform a conversion to save
                    your first record.
                  </p>
                </div>
              ) : (
                <DataTableTable>
                  <DataTableHeaderRow>
                    <DataTableHead>Conversion Type</DataTableHead>
                    <DataTableHead>Input Value</DataTableHead>
                    <DataTableHead>Output Value</DataTableHead>
                    <DataTableHead>Date</DataTableHead>
                    <DataTableHead>Action</DataTableHead>
                  </DataTableHeaderRow>
                  <DataTableBody>
                    {history.map((entry) => (
                      // console.log()
                      <DataTableRow key={entry.id}>
                        <DataTableCell>
                          <Badge
                            style={{
                              backgroundColor: converterColorSelector(
                                entry.category.toLowerCase(),
                              ),
                            }}
                            className={` text-white`}
                          >
                            {entry.category.toUpperCase()}
                          </Badge>
                        </DataTableCell>
                        <DataTableCell>
                          <span className='pr-2'>
                            {entry.input_value.toLocaleString()}
                          </span>
                          <span>{entry.from_unit}</span>
                        </DataTableCell>
                        <DataTableCell>
                          <span className='pr-2'>
                            {entry.output_value.toLocaleString()}
                          </span>
                          <span>{entry.to_unit}</span>
                        </DataTableCell>
                        <DataTableCell>
                          {entry.converted_at
                            ? new Date().getFullYear() ===
                              new Date(entry.converted_at).getFullYear()
                              ? new Date(entry.converted_at).toLocaleString(
                                  "en-us",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  },
                                )
                              : new Date(entry.converted_at).toLocaleString(
                                  "en-us",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    year: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  },
                                )
                            : "-"}
                        </DataTableCell>
                        <DataTableCell>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              void deleteConversionHistory(entry.id).then(
                                () => void refetch(),
                              )
                            }
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </DataTableCell>
                      </DataTableRow>
                    ))}
                  </DataTableBody>
                </DataTableTable>
              )}
            </DataTableContent>
          </DataTable>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionHistory;
