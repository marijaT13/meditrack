import { DataTable } from '@/components/table/DataTable';
import StatCard from '@/components/StatCard';
import { columns } from '@/components/table/columns';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';
import ProfileButton from '@/components/ProfileButton';

const AdminPage = async () => {
  const appointments = await getRecentAppointmentList();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-red-600 rounded-full -z-10"></div>

        <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full2.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        {/* Doctor Profile Button */}
        <ProfileButton />
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Добредојде</h1>
          <p className="text-dark-700">
            Започни со прегледување на најновите закажани термини и управување со системот.
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Закажани термини"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Термини во очекување"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Откажани термини"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default AdminPage;
