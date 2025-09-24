"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const ProfileButton = () => {
  const [doctorId, setDoctorId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("doctorId");
    if (storedId) setDoctorId(storedId);
  }, []);

  if (!doctorId) return null;

  return (
    <Button asChild>
      <Link href={`/doctors/${doctorId}/profile`}>
        <Image
        src="/assets/icons/profile-page.svg"
        width={32}
        height={32}
        alt="admin dashboard"
        
        />
      </Link>
    </Button>
  );
};

export default ProfileButton;
