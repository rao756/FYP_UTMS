'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import axios from 'axios';
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
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  busId: z.string().min(1, 'Bus ID is required'),
  busRoute: z.string().min(1, 'Bus Route is required'),
  busNumber: z.string().min(1, 'Bus Number is required'),
  busSeats: z.number().min(1, 'Bus Seats must be at least 1'),
  isActive: z.boolean().default(true),
});

export default function BusForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: any;
  onSubmit?: (values: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      busId: '',
      busRoute: '',
      busNumber: '',
      busSeats: 0,
      isActive: true,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        const response = await axios.post('/api/buses', values);
        if (response.status === 201) {
          toast.success('Bus created successfully');
          form.reset();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error creating bus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="busId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bus ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bus ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="busRoute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bus Route</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bus route" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="busNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bus Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bus number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="busSeats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bus Seats</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of seats"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
              {loading
                ? 'Loading...'
                : defaultValues
                  ? 'Update Bus'
                  : 'Create Bus'}
            </Button>
          </form>
        </Form>
      </>
    </>
  );
}
