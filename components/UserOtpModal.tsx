'use client';

import { encryptKey } from "@/lib/utils";
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
import Image from "next/image";
import { verifyOtp } from "@/lib/actions/patient.actions";

interface UserPasskeyProps{
    userId: string;
    email: string;
    redirectTo?: string;
    onClose?:() => void;
}

export const UserOtpModal = ({userId, redirectTo = `/patients/${userId}/new-appointment`, onClose,email}: UserPasskeyProps) =>{
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const validateOtp = async () => {
      setIsLoading(true);
      
    try {
      // If you created the API route, use this:
      await verifyOtp(userId, otp);

      // If your server function is client-callable you can use:
      // await verifyOtp(userId, otp);

      console.log("verify success - redirecting");
      await router.push(`/patients/${userId}/new-appointment`);
      onClose?.();
    } catch (err: any) {
      console.error("verify error:", err);
      setError(err?.message ?? "Невалиден OTP код. Обидете се повторно.");
    } finally {
      setIsLoading(false);
    }
  };


    
    const closeModal = () => {
        if (onClose) onClose();
        router.push("/");
    };

    return(
    <AlertDialog open={true} onOpenChange={closeModal}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Кориснички пристап
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={closeModal}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            За влез во корисничкиот профил, внесете го вашиот код.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
           <InputOTPGroup className="shad-otp">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const isActive = i === otp.length; // current slot
              const isFilled = i < otp.length;   // already typed
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
            onClick={validateOtp}
            className="shad-primary-btn w-full"
          >
            Внеси код
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    );
 };