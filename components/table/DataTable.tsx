"use client"
import * as React from "react"

import {
  ColumnDef,
  SortingState,
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
<div className="w-full overflow-x-auto">
    <div className="data-table hidden sm:block">
      <Table className="shad-table">
        <TableHeader className="bg-red-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="shad-table-row-header">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className=" border-separate border-spacing-y-3 border-spacing-x-2">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="shad-table-row"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center py-4 px-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Нема резултати.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    <div className="md:hidden space-y-4">
  {table.getRowModel().rows.map((row) => (
    <div
      key={row.id}
      className="rounded-xl border p-4 shadow-sm bg-white"
    >
      {row.getVisibleCells().map((cell) => (
        <div
          key={cell.id}
          className="flex justify-between py-2 border-b last:border-none"
        >
          <span className="font-medium text-gray-500">
            {cell.column.columnDef.header as string}
          </span>

          <span className="text-right">
            {flexRender(
              cell.column.columnDef.cell,
              cell.getContext()
            )}
          </span>
        </div>
      ))}
    </div>
  ))}
</div>
    <div className="table-actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="shad-gray-btn"
        >
          <Image 
          src="/assets/icons/arrow.svg"
          width={24}
          height={24}
          alt="arrow"
          />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="shad-gray-btn"
        >
          <Image 
          src="/assets/icons/arrow.svg"
          width={24}
          height={24}
          alt="arrow"
          className="rotate-180"
          />
        </Button>
        
      </div>
      </div>
    </div>
  )
}