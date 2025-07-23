'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DriverForm from './addDriver';

export default function DriverTable() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDriver, setEditingDriver] = useState<any | null>(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/drivers');
      setDrivers(response.data.drivers);
    } catch (error) {
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete('/api/drivers', {
        data: { _id: id },
      });
      if (response.status === 200) {
        toast.success('Driver deactivated');
        fetchDrivers();
      }
    } catch (error) {
      toast.error('Error deactivating driver');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-2 md:flex-row md:justify-between">
        <h2 className="text-xl font-semibold leading-none tracking-tight md:text-2xl">
          Drivers
        </h2>
        <div className="flex gap-2">
          <Button size={'sm'} variant={'secondary'} onClick={fetchDrivers}>
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size={'sm'}>Add Driver</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Driver</DialogTitle>
                <DialogDescription>
                  Enter details to create a new driver.
                </DialogDescription>
              </DialogHeader>
              <DriverForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table className="rounded-md border">
        <TableHeader>
          <TableRow>
            <TableHead>Driver ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver._id}>
              <TableCell>{driver.driverId}</TableCell>
              <TableCell>{driver.driverName}</TableCell>
              <TableCell>{driver.driverLicense}</TableCell>
              <TableCell>{driver.isActive ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingDriver(driver)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Driver</DialogTitle>
                    </DialogHeader>
                    <DriverForm
                    //   defaultValues={editingDriver}
                    //   onSubmit={async (values) => {
                    //     try {
                    //       const response = await axios.put('/api/drivers', {
                    //         _id: editingDriver._id,
                    //         ...values,
                    //       });
                    //       if (response.status === 200) {
                    //         toast.success('Driver updated');
                    //         fetchDrivers();
                    //       }
                    //     } catch (error) {
                    //       toast.error('Error updating driver');
                    //     }
                    //   }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  className="ml-2"
                  onClick={() => handleDelete(driver._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
