'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import AppointmentForm from './forms/AppointmentForm';
import { Appointment } from '@/types/appwrite.types';
interface AppointmentModalProps {
  type: 'schedule' | 'cancel'
  patientId: string
  userId: string
  appointment?: Appointment
  trigger?: React.ReactNode
}

const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment,
  trigger,
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>

    <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="ghost"
            className={`capitalize ${
              type === "schedule" && "text-blue-600"
            }`}
          >
            {type}
          </Button>
        )}
      </DialogTrigger>
    
    <DialogContent className='shad-dialog sm:max-w-md'>
        <DialogHeader className='mb-4 space-y-3'>
            <DialogTitle className='capitalize'>{type} Appointment</DialogTitle>
            <DialogDescription>
                Please fill in the following details to {type} an appointment.
            </DialogDescription>
        </DialogHeader>
        <AppointmentForm 
            userId={userId}
            patientId={patientId}
            appointment={appointment}
            type={type}
            setOpen={setOpen}
        />
    </DialogContent>
</Dialog>
  )
}
export default AppointmentModal