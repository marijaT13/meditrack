
import { Button } from '@/components/ui/button';
import { Doctors } from '@/constants';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import { SearchParamProps } from '@/types';
import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import Animation from '@/components/Animation';
const Success = async ({
  searchParams,
  params,
}: SearchParamProps<'userId'>) => {
  const { userId } = await params;
  const resolvedSearchParams = await searchParams;

  const appointmentId = (resolvedSearchParams?.appointmentId as string) || '';
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full2.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          {/*  */}
          <Animation/>

          <h2 className="header mb-6 max-w-[600px] text-center">
            Твоето <span className="text-green-500">барање за термин</span> е успешно испратено!
          </h2>
          <p>За кратко ќе бидете контактирани.</p>
        </section>

        <section className="request-details">
          <p>Детали за вашиот побаран термин:</p>

          {doctor && (
            <div className="flex items-center gap-3">
              <Image
                src={doctor.image}
                alt="doctor"
                width={100}
                height={100}
                className="size-6"
              />
              <p className="whitespace-nowrap">Др. {doctor.name}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              alt="calendar"
              width={24}
              height={24}
            />
            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <div className="flex gap-10">
          <Button variant="default" className="shad-primary-btn" asChild>
            <Link href={`/patients/${userId}/new-appointment`}>
              Нов термин
            </Link>
          </Button>

          <Button variant="default" className="bg-red-500" asChild>
            <Link href={`/patients/${userId}/profile`} className='text-white'>
              Кон твојот профил
            </Link>
          </Button>
        </div>

        <p className="copyright">
          ©{new Date().getFullYear()} MediTrack
        </p>
      </div>
    </div>
  );
};

export default Success;
