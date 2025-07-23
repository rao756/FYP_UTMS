'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  notificationMessage: z.string().min(1, 'Notification Message is required'),
  isActive: z.boolean().default(true),
});

export default function NotificationForm({
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
      notificationMessage: '',
      isActive: true,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        const response = await axios.post('/api/notifications', values);
        if (response.status === 201) {
          toast.success('Notification created successfully');
          form.reset();
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Error creating notification'
      );
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
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="notificationMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notification Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter notification message"
                      {...field}
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
                  ? 'Update Notification'
                  : 'Create Notification'}
            </Button>
          </form>
        </Form>
      </>
    </>
  );
}
