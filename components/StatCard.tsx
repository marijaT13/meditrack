import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface StatCardProps{
    type: 'appointments' | 'pending' | 'cancelled'
    count: number
    label: string
    icon: string
}

const StatCard = ({count = 0, label, icon, type }: StatCardProps) =>{
    return(
        <div className={clsx('stat-card',{
            'bg-appointments':type === 'appointments',
            'bg-pending': type === 'pending',
            'bg-cancelled':type === 'cancelled',
        })}>
            <div className='flex items-center gap-4'>
                <Image
                    src={icon}
                    height={30}
                    width={30}
                    alt={label}
                    className='size-8 w-fit'
                />
                <h2 className={clsx('text-32-bold',{
                    'text-yellow-400':type ==='appointments',
                    'text-blue-300':type === 'pending',
                    'text-red-400':type === 'cancelled',
                })}
                
                >{count}</h2>
            </div>
            <p  className={clsx('text-14-regular', {
                'text-yellow-600': type === 'appointments',
                'text-blue-600': type === 'pending',
                'text-red-600': type === 'cancelled',
                })}
            >{label}</p>
        </div>
    )
}
export default StatCard;