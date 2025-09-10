import clsx from 'clsx'
import React from 'react'

const StatusBadge = ({status}: {status: Status}) => {
    return(
        <div className={clsx('status-badge',{
            'bg-green-600': status === 'scheduled',
            
        })}>Status badge</div>
    )

}
export default StatusBadge