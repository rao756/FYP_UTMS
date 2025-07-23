'use client'; // If using Next.js App Router

import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Define the schema with Zod
const formSchema = z.object({
  accountNo: z.string().min(1, 'Account No is required'),
  session: z.string().min(1, 'Session is required'),
  amount: z.string().min(1, 'Amount is required'),
  issueDate: z.string().min(1, 'Issue Date is required'),
  lastDate: z.string().min(1, 'Last Date is required'),
  maxChallan: z.string().optional(), // Optional field
});

type FormValues = z.infer<typeof formSchema>;

const UpdateChallanForm = () => {
  const [id, setID] = useState('');

  // Initialize React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNo: '',
      session: '',
      amount: '',
      issueDate: '',
      lastDate: '',
      maxChallan: '',
    },
  });

  // Fetch initial challan data
  useEffect(() => {
    const fetchChallan = async () => {
      try {
        const response = await axios.get(`/api/adminChallan`);
        const data = response.data.adminChallan;
        setID(data._id);
        // Set form values with fetched data
        form.reset({
          accountNo: data?.accountNo || '',
          session: data?.session || '',
          amount: data?.amount || '',
          issueDate: data?.issueDate ? data.issueDate.split('T')[0] : '', // Format date for input
          lastDate: data?.lastDate ? data.lastDate.split('T')[0] : '', // Format date for input
          maxChallan: data?.maxChallan || '',
        });
      } catch (error) {
        console.error('Error fetching the challan data', error);
        toast.error('Failed to fetch challan data');
      }
    };

    fetchChallan();
  }, [id, form]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      const response = await axios.put(`/api/adminChallan`, values);
      toast.success('Challan updated successfully');
      form.reset(values); // Reset form with current values to prevent clearing
    } catch (error) {
      console.error('Error updating the challan data', error);
      toast.error('Failed to update challan');
    }
  };

  return (
    <>
      <Card className="mx-auto w-full bg-popover shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold">Update Challan</h2>
        </CardHeader>
        <CardContent className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Account No */}
                <FormField
                  control={form.control}
                  name="accountNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account No</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter account number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Session */}
                <FormField
                  control={form.control}
                  name="session"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter session" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Issue Date */}
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Date */}
                <FormField
                  control={form.control}
                  name="lastDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Challan */}
                <FormField
                  control={form.control}
                  name="maxChallan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Challan</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter max challan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full md:w-auto">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default UpdateChallanForm;
