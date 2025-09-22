import { Button } from '@/components/ui/button';
import { Doctors } from '@/constants';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Success= async({
    searchParams,
    params:{userId},
}:SearchParamProps)=>{
    const appointmentId = (searchParams?.appointmentId as string) || "";
    const appointment = await getAppointment(appointmentId);
    const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
    );
    return(
        <div className='flex h-screen max-h-screen px-[5%]'>
            <div className='success-img'>
                <Link href='/'>
                    <Image 
                        src="/assets/icons/logo-full.svg"
                        height={1000}
                        width={1000}
                        alt="logo"
                        className='h-10 w-fit'
                    />
                </Link>
                <section className='flex flex-col items-center'>
                    <Image 
                        src="/assets/gifs/success.gif"
                        height={300}
                        width={280}
                        alt='success'
                    />
                <h2 className='header mb-6 max-w-[600px] text-center'>
                    Твоето <span className='text-green-500'>барање за термин</span> е успешно испратено!
                </h2>
                <p>За кратко ќе бидете контактирани. </p>
                </section>

                <section className='request-details'>
                    <p> Детали за вашиот побаран термин: </p>
                    <div className='flex items-center gap-3'>
                        <Image
                        src={doctor?.image!}
                        alt='doctor'
                        width={100}
                        height={100}
                        className='size-6'
                        />
                        <p className='whitespace-nonwrap'>Др. {doctor?.name}</p>
                    </div>
                    <div className='flex gap-2'>
                        <Image
                        src='/assets/icons/calendar.svg'
                        alt="caledar"
                        width={24}
                        height={24}
                        />
                        <p>{formatDateTime(appointment.schedule).dateTime}</p>
                    </div>
                </section>
                <Button variant="outline" className='shad-primary-btn' asChild>
                    <Link href={`/patients/${userId}/new-appointment`}> 
                    Нов термин </Link>
                </Button>
                 <p className="copyright">
                    ©2025 MediTrack
                 </p>
            </div>
        </div>
    );
};
export default Success