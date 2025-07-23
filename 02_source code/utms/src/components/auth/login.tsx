'use client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { ThemeToggle } from '../theme/theme-toggle';
import { useState } from 'react';
import Loading from '../loading/loading';
import { PasswordInput } from '../ui/password-input';
import axios from 'axios';
import Image from 'next/image';

const formSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const type = searchParams.get('u') ?? 'user';
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      let url = `/api/users/login/`;

      if (type === 'admin') {
        url = `/api/admin/login/`;
      } else if (type === 'user') {
        url = `/api/users/login/`;
      }

      const data = {
        email: values.email,
        password: values.password,
        type: type,
      };

      const response: any = await axios.post(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });
      console.log(response);

      // const response = await signIn('credentials', {
      //   redirect: false,
      //   email: values.email,
      //   password: values.password,
      //   type: type,
      // });

      if (response?.status === 200) {
        const id = response?.data?.user?._id;
        const token = response?.data?.token;
        const userName = response?.data?.user?.userName;
        const fatherName = response?.data?.user?.fatherName;
        const rollNo = response?.data?.user?.rollNo;
        const email = response?.data?.user?.email;
        const departmentName = response?.data?.user?.departmentName;
        const semester = response?.data?.user?.semester;


        const loginResponse = await signIn('credentials', {
          redirect: false,
          id,
          token,
          userName,
          fatherName,
          rollNo,
          email,
          departmentName,
          semester,
          type,
        });

        console.log(loginResponse);

        if (!loginResponse?.error) {
          toast.success('Logged in successfully');
          router.push('/dashboard');
        } else {
          const errorMessage =
            loginResponse?.error === 'Configuration' && 'Invalid credentials';
          toast.error(errorMessage);
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Form submission error', error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-[96%] max-w-[500px] border-none !bg-transparent">
      <CardHeader className="flex w-full justify-center">
        <Link href='/'>
        <Image
          src="/uon.png"
          alt="uon"
          width={200}
          className="mx-auto"
          height={200}
          />
        </Link>
        <div className="w-full space-y-2">
          <CardTitle className="text-center">
            <span>Login to UTMS</span>
            {type && <span className="text-sm"> ({type})</span>}
          </CardTitle>
          <CardDescription className="text-center">
            Please provide your email and password.
          </CardDescription>
        </div>
        {/* <ThemeToggle /> */}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="password"
                      placeholder="******"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full disabled:bg-secondary"
            >
              {loading ? <Loading /> : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="text-center">
        <Link href={'/forget-password'}>
          <Button type="button" variant={'link'} className="underline">
            Forgot Password?
          </Button>
        </Link>
      </div>
      <CardFooter className="flex justify-center space-x-1 text-sm">
        <span>Don&apos;t have an account? </span>
        <Link className="text-primary underline" href={'/register'}>
          Register now
        </Link>
      </CardFooter>
    </Card>
  );
}
