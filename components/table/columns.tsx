
'use client'
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import StatusBadge from "../StatusBadge"
import { Appointment } from "@/types/appwrite.types"
import { formatDateTime } from "@/lib/utils"

 
export const columns: ColumnDef<Appointment>[] = [ 
  {
    header:'#',
    cell:({row})=><p className='text-14-medium'> {row.index +1} </p>
  
  },
  {
    accessorKey:'patient',
    header:'Patient',
    cell:({row})=> <p className="text-14-medium">{row.original.patient.name}</p>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell:({row}) => (<div className="min-w-[115px]">
       <StatusBadge status={row.original.status} />
    </div>)
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell:({row})=>{
      <p className="text-14-regular min-w-[100px]">
        {}</p>
    }
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
   {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-black">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
      
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
