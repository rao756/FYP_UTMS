'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';

// Schema for a single stop
const stopSchema = z.object({
  stopName: z.string().min(1, 'Stop name is required'),
  arrivalTime: z.string().min(1, 'Arrival time is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
});

// Form schema
const formSchema = z.object({
  scheduleId: z.string().min(1, 'Schedule ID is required'),
  busId: z.string().min(1, 'Bus Number is required'), // Stores busNumber
  driverId: z.string().min(1, 'Driver Name is required'), // Stores driverName
  routeName: z.string().min(1, 'Route Name is required'), // Stores routeName
  stops: z.array(stopSchema).min(1, 'At least one stop is required'),
});

interface SchedulesFormDialogProps {
  schedule: any; // The schedule object passed as a prop (null for create)
  open: boolean; // Controls dialog visibility
  onOpenChange: (open: boolean, updatedSchedule?: any) => void; // Callback
}

const SchedulesFormDialog = ({
  schedule,
  open,
  onOpenChange,
}: SchedulesFormDialogProps) => {
  const [buses, setBuses] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduleId: '',
      busId: '',
      driverId: '',
      routeName: '',
      stops: [{ stopName: '', arrivalTime: '', departureTime: '' }],
    },
  });

  // Use useFieldArray to manage the stops array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stops',
  });

  // Fetch buses, drivers, and routes
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const [busesRes, driversRes, routesRes] = await Promise.all([
          axios.get('/api/buses'),
          axios.get('/api/drivers'),
          axios.get('/api/routes'),
        ]);
        setBuses(busesRes.data.buses || []);
        setDrivers(driversRes.data.drivers || []);
        setRoutes(routesRes.data.routes || []);
      } catch (error) {
        toast.error('Failed to fetch options');
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  // Reset form values when schedule prop changes (for editing)
  useEffect(() => {
    if (schedule) {
      form.reset({
        scheduleId: schedule.scheduleId || '',
        busId: schedule.busId || '', // busNumber
        driverId: schedule.driverId || '', // driverName
        routeName: schedule.routeName || '',
        stops:
          schedule.stops?.length > 0
            ? schedule.stops.map((stop: any) => ({
                stopName: stop.stopName || '',
                arrivalTime: stop.arrivalTime || '',
                departureTime: stop.departureTime || '',
              }))
            : [{ stopName: '', arrivalTime: '', departureTime: '' }],
      });
    } else {
      form.reset({
        scheduleId: '',
        busId: '',
        driverId: '',
        routeName: '',
        stops: [{ stopName: '', arrivalTime: '', departureTime: '' }],
      });
    }
  }, [schedule, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = {
        scheduleId: values.scheduleId,
        busId: values.busId, // Stores busNumber
        driverId: values.driverId, // Stores driverName
        routeName: values.routeName,
        stops: values.stops,
      };

      let response;

      if (schedule) {
        // Update existing schedule (PATCH)
        response = await axios.patch('/api/schedules', {
          ...data,
          _id: schedule._id,
        });
      } else {
        // Add new schedule (POST)
        response = await axios.post('/api/schedules', data);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          schedule
            ? 'Schedule updated successfully'
            : 'Schedule added successfully'
        );
        onOpenChange(false, response.data.schedule);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit the form. Please try again.', {
        description:
          error.response?.data?.error ||
          error.message ||
          'Unknown error occurred',
      });
    }
  }

  const addStop = () => {
    append({ stopName: '', arrivalTime: '', departureTime: '' });
  };

  const removeStop = (index: number) => {
    remove(index);
  };

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="min-h-[600px] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {schedule ? 'Update Schedule' : 'Create Schedule'}
          </DialogTitle>
          <DialogDescription>
            {schedule
              ? `Update schedule ${schedule?.routeName}`
              : 'Fill the form to add a new schedule'}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="scheduleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter schedule ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="busId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bus Number</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingOptions}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bus" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {buses.map((bus) => (
                            <SelectItem key={bus._id} value={bus.busNumber}>
                              {bus.busNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="driverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Name</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingOptions}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select driver" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {drivers.map((driver) => (
                            <SelectItem
                              key={driver._id}
                              value={driver.driverName}
                            >
                              {driver.driverName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="routeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route Name</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingOptions}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select route" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {routes.map((route) => (
                            <SelectItem key={route._id} value={route.routeName}>
                              {route.routeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dynamic Stops Section */}
            <div className="max-h-[400px] space-y-4 overflow-y-auto rounded-md border border-input p-4">
              <div className="flex w-full justify-between">
                <h3 className="text-lg font-semibold">Stops</h3>
                <Button type="button" variant="outline" onClick={addStop}>
                  Add Stop
                </Button>
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-4 items-end gap-4 sm:grid-cols-12"
                >
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name={`stops.${index}.stopName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stop Name {index + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter stop name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name={`stops.${index}.arrivalTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arrival Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter arrival time (e.g., 08:00)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`stops.${index}.departureTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departure Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter departure time (e.g., 08:05)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      disabled={index === 0}
                      variant="destructive"
                      size="icon"
                      onClick={() => removeStop(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button size="sm" type="submit">
                {schedule ? 'Update Schedule' : 'Add Schedule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulesFormDialog;
