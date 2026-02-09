"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { encryptKey } from "@/lib/utils";

interface PasskeyModalProps {
  redirectTo?: string; // default to /doctors
  onClose?: () => void;
}

export const PasskeyModal = ({ redirectTo = "/doctors", onClose }: PasskeyModalProps) => {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const validatePasskey = () => {
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem("accessKey", encryptedKey);

      if (onClose) onClose();
      router.push(redirectTo);
    } else {
      setError("Кодот кој го внесивте не е валиден. Пробајте повторно.");
    }
  };

  const closeModal = () => {
    if (onClose) onClose();
    router.push("/");
  };

  return (
    <AlertDialog open={true} onOpenChange={() => {}}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Докторски пристап
           <svg xmlns="http://www.w3.org/2000/svg"  onClick={closeModal} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </AlertDialogTitle>
          <AlertDialogDescription>
            За влез во докторскиот панел, внесете го вашиот код.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="shad-otp">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const isActive = i === passkey.length; // current slot
              const isFilled = i < passkey.length;   // already typed
              return (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={`
                    shad-otp-slot
                    ${isFilled ? "bg-blue-700 border-blue-300" : ""}
                    ${isActive ? "border-red-500 animate-pulse" : ""}
                  `}
                      />
                    );
                  })}
              </InputOTPGroup>
        </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">{error}</p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={validatePasskey}
            className="shad-primary-btn w-full"
          >
            Внеси код
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
