import * as React from "react";
import { cn } from "@/lib/utils";

function DataTable({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-3xl border border-border bg-background shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function DataTableHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5 sm:px-8",
        className,
      )}
      {...props}
    />
  );
}

function DataTableTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold text-foreground sm:text-xl",
        className,
      )}
      {...props}
    />
  );
}

function DataTableDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

function DataTableContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("w-full overflow-x-auto", className)} {...props} />;
}

function DataTableTable({
  className,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <table
      className={cn(
        "min-w-full border-separate border-spacing-0 text-left",
        className,
      )}
      {...props}
    />
  );
}

function DataTableHeaderRow({
  className,
  ...props
}: React.ComponentProps<"tr">) {
  return <tr className={cn("bg-muted/60", className)} {...props} />;
}

function DataTableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      scope='col'
      className={cn(
        "whitespace-nowrap border-b border-border/70 px-6 py-4 text-left text-sm font-semibold uppercase text-muted-foreground first:rounded-tl-3xl last:rounded-tr-3xl",
        className,
      )}
      {...props}
    />
  );
}

function DataTableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody className={cn("divide-y divide-border/70", className)} {...props} />
  );
}

function DataTableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("odd:bg-background even:bg-muted/5", className)}
      {...props}
    />
  );
}

function DataTableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "whitespace-nowrap px-6 py-4 text-sm text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  DataTable,
  DataTableHeader,
  DataTableTitle,
  DataTableDescription,
  DataTableContent,
  DataTableTable,
  DataTableHeaderRow,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableCell,
};
