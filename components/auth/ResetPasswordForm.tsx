"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPassword } from "@/lib/auth-client";

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget as HTMLFormElement);
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));

    if (!password) return toast.error("Please enter new password");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");
    if (password.length < 6)
      return toast.error("Password must be at least 8 characters long");

    await resetPassword({
      newPassword: password,
      token,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Password reset successfully!");
          router.push("/auth/sign-in");
        },
      },
    });
  }

  return (
    <div className='container mx-auto max-w-6xl min-h-[80vh] items-center flex flex-col justify-center space-y-8'>
      <div className='space-y-8'>
        <h1 className='text-3xl font-bold'>Email Verification</h1>
      </div>

      <form onSubmit={handleSubmit} className='max-w-sm w-full space-y-4'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='password'>New Password</Label>
          <Input type='password' id='password' name='password' />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input type='password' id='confirmPassword' name='confirmPassword' />
        </div>
        <Button type='submit' disabled={isPending}>
          Reset Password
        </Button>
      </form>
    </div>
  );
};
