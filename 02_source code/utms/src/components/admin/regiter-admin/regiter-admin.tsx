'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import axios from 'axios';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Card, CardContent } from '@/components/ui/card';

// Define the schema with Zod
const formSchema = z.object({
  userName: z.string().optional(),
  fatherName: z.string().optional(),
  rollNo: z.string().optional(),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  departmentName: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  image: z.string().optional(),
  isActive: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const AdminRegisterForm = () => {
  // Initialize React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      fatherName: '',
      rollNo: '',
      email: '',
      departmentName: '',
      password: '',
      image: '',
      isActive: false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      const response = await axios.post('/api/admin/register', values);
      toast.success('Admin registered successfully');
      form.reset(); // Reset form after submission
    } catch (error: any) {
      console.error('Error registering admin:', error);
      toast.error(error.response?.data?.message || 'Failed to register admin');
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size={'sm'}>Add Admin</Button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto h-screen max-w-2xl md:h-auto overflow-y-auto">
        <DrawerHeader className="flex flex-col items-center">
          <DrawerTitle>Register Admin</DrawerTitle>
          <DrawerDescription>
            Fill out the form to register a new admin.
          </DrawerDescription>
        </DrawerHeader>
        <Card className="w-full border-none">
          <CardContent className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* User Name */}
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter user name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Father Name */}
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter father name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Roll No */}
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

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Department Name */}
                  <FormField
                    control={form.control}
                    name="departmentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter department name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Is Active */}
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium">
                          Is Active
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <DrawerFooter>
                  <Button type="submit" className="w-full md:w-auto">
                    Register Admin
                  </Button>
                  <DrawerClose className="w-full">
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full md:w-auto"
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DrawerContent>
    </Drawer>
  );
};

export default AdminRegisterForm;
