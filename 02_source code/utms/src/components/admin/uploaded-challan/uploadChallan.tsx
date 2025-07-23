'use client';
import { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession } from 'next-auth/react';

const formSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  rollNo: z.string().min(1, 'Roll Number is required'),
  challanStatus: z.enum(['pending', 'Paid', 'Not Paid']),
  image: z.any().optional(),
});

export default function UploadChallanForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: any;
  onSubmit?: (values: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { data: session }: any = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      userId: session?.user?.id,
      rollNo: '',
      challanStatus: 'pending',
      image: null,
    },
  });

  useEffect(() => {
    if (session?.user?.id) {
      form.setValue('userId', session?.user?.id);
    }
  }, [session?.user]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('userId', values.userId);
      formData.append('rollNo', values.rollNo);
      formData.append('challanStatus', values.challanStatus);
      if (values.image && values.image instanceof File) {
        formData.append('image', values.image);
      }

      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const response = await axios.post('/api/uploaded-challans', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.status === 201) {
          toast.success('Challan uploaded successfully');
          form.reset();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error uploading challan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full bg-card/70 sm:w-[500px]">
      <CardHeader>
        <CardTitle className="text-center">Upload Challan</CardTitle>
        <CardDescription className="text-center">
          Upload a new challan with user details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter user ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rollNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter roll number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="challanStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challan Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Not Paid">Not Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challan Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(
                          e.target.files ? e.target.files[0] : null
                        )
                      }
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
                  ? 'Update Challan'
                  : 'Upload Challan'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
