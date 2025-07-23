'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import Link from 'next/link';
import { PasswordInput } from '../ui/password-input';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const formSchema = z.object({
  userName: z.string().min(1, 'Name is required').max(30),
  fatherName: z.string().min(1, 'Father Name is required').max(15),
  rollNo: z.string().min(1, 'Roll No is required').max(15),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(15),
  departmentName: z.string().min(1, 'Department Name is required'),
  semester: z.string().min(1, 'Semester is required'),
  routeName: z.string().min(1, 'Route Name is required'),
  pickupStop: z.string().min(1, 'Pickup Stop is required'),
});

const RegisterForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      fatherName: '',
      rollNo: '',
      email: '',
      password: '',
      departmentName: '',
      semester: '',
      routeName: '',
      pickupStop: '',
    },
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const onSubmit = async (data: {
    userName: string;
    fatherName: string;
    rollNo: string;
    email: string;
    password: string;
    departmentName: string;
    semester: string;
    routeName: string;
    pickupStop: string;
  }) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (imageFile) {
        formData.append('photo', imageFile);
      }

      const response = await axios.post('/api/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        toast.success('Your registration request has been submitted.');
        form.reset();
        router.push('/login');
      } else {
        toast.error('Error creating user');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error creating user');
    }
  };

  return (
    <Card className="scroll mx-auto h-[96vh] w-[96%] overflow-y-auto border-none !bg-transparent shadow-none sm:w-11/12 md:h-auto">
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
            <span>Register</span>
          </CardTitle>
          <CardDescription className="text-center">
            Please provide your information.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter father's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <FormField
                control={form.control}
                name="rollNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll No</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter roll number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>{' '}
            <div className="grid gap-2 md:grid-cols-2">
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter department name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter semester" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="routeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter route name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <FormField
                control={form.control}
                name="pickupStop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Stop</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pickup stop" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Profile Picture Upload */}
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            <Button type="submit">Register</Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center space-x-1 text-sm">
        <span>Already have an account? </span>
        <Link className="text-primary underline" href={'/login'}>
          Login now
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
