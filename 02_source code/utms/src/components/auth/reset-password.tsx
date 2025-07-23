'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input'; // Assuming this is your custom PasswordInput
import Link from 'next/link';
import { toast } from 'sonner';
import Loading from '../loading/loading';
import Image from 'next/image';

// Form schema for validation
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  currentPassword: z
    .string()
    .min(1, { message: 'Current password is required' }),
  newPassword: z
    .string()
    .min(6, { message: 'New password must be at least 6 characters' }),
});

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);

  // Initialize form with react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      currentPassword: '',
      newPassword: '',
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const url = '/api/reset-password';
      const response = await axios.post(url, {
        email: values.email,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (response.status === 200) {
        toast.success('Password reset successfully');
        form.reset(); // Clear form after success
        // Optionally redirect: router.push('/login');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      const errorMessage =
        error.response?.data?.message || 'Error resetting password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-[96%] max-w-[500px] border-none bg-transparent shadow-none">
      <CardHeader className="flex flex-col items-center">
        <Image
          src="/uon.png"
          alt="uon"
          width={200}
          className="mx-auto"
          height={200}
        />

        <CardTitle>Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email, current password, and new password to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="currentPassword"
                      placeholder="******"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="newPassword"
                      placeholder="******"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full disabled:bg-secondary"
            >
              {loading ? <Loading /> : 'Reset Password'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center space-x-1 text-sm">
        <span>Remembered your password? </span>
        <Link className="text-primary underline" href={'/login'}>
          Login now
        </Link>
      </CardFooter>
    </Card>
  );
}
