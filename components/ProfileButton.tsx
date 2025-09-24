"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ProfileButton = () => {
  const [doctorId, setDoctorId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("doctorId");
    if (storedId) setDoctorId(storedId);
  }, []);

  if (!doctorId) return null;

  return (
    <Button asChild>
      <Link href={`/doctors/${doctorId}/profile`}>Мој Профил</Link>
    </Button>
  );
};

export default ProfileButton;
