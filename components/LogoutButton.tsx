"use client";

import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite.config";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

 const handleLogout = async () => {
    // If using server-only auth, just redirect
    router.push("/"); 
  };


  return (
    <Button variant="destructive" 
    className="bg-red-500 mt-5"
    onClick={handleLogout}>
      Logout
    </Button>
  );
}
