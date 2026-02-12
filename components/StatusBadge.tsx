import { StatusIcon } from '@/constants';
import { Status } from '@/types';
import clsx from 'clsx'
import Image from 'next/image';
import React from 'react'
interface StatusBadgeProps {
    status: Status
    onClick?: () => void
    disabled?: boolean
}

const StatusBadge = ({status, onClick, disabled}: StatusBadgeProps) => {
    return(
         <div
      onClick={!disabled ? onClick : undefined}
      className={clsx(
        'status-badge flex items-center gap-2 px-3 py-1 rounded-full transition',
        {
          'bg-green-900': status === 'scheduled',
          'bg-blue-600': status === 'pending',
          'bg-red-600': status === 'cancelled',
          'cursor-pointer hover:opacity-80': onClick && !disabled,
          'cursor-not-allowed opacity-60': disabled,
        }
      )}
    >
            <Image
            src={StatusIcon[status]}
            alt={status}
            width={24}
            height={24}
            className='h-fit w-3'
            />
            <p className={clsx('text-12-semibold capitalize',{
                'text-green-400': status === 'scheduled',
                'text-blue-500': status === 'pending',
                'text-red-500': status === 'cancelled',
            })}>{status}</p>
        </div>
    )

}
export default StatusBadge;