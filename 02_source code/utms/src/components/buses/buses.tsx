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
import BusForm from './addBus';

export default function BusTable() {
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBus, setEditingBus] = useState<any | null>(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/buses');
      setBuses(response.data.buses);
    } catch (error) {
      toast.error('Failed to fetch buses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete('/api/buses', { data: { _id: id } });
      if (response.status === 200) {
        toast.success('Bus deactivated');
        fetchBuses();
      }
    } catch (error) {
      toast.error('Error deactivating bus');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-2 md:flex-row md:justify-between">
        <h2 className="text-xl font-semibold leading-none tracking-tight md:text-2xl">
          Buses
        </h2>
        <div className="flex gap-2">
          <Button size={'sm'} variant={'secondary'} onClick={fetchBuses}>
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size={'sm'}>Add Bus</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Bus</DialogTitle>
                <DialogDescription>
                  Enter details to add a new bus.
                </DialogDescription>
              </DialogHeader>
              <BusForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table className="rounded-md border">
        <TableHeader>
          <TableRow>
            <TableHead>Bus ID</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buses.map((bus) => (
            <TableRow key={bus._id}>
              <TableCell>{bus.busId}</TableCell>
              <TableCell>{bus.busRoute}</TableCell>
              <TableCell>{bus.busNumber}</TableCell>
              <TableCell>{bus.busSeats}</TableCell>
              <TableCell>{bus.isActive ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingBus(bus)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Bus</DialogTitle>
                    </DialogHeader>
                    <BusForm
                      defaultValues={editingBus}
                      onSubmit={async (values) => {
                        try {
                          const response = await axios.put('/api/buses', {
                            _id: editingBus._id,
                            ...values,
                          });
                          if (response.status === 200) {
                            toast.success('Bus updated');
                            fetchBuses();
                          }
                        } catch (error) {
                          toast.error('Error updating bus');
                        }
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  className="ml-2"
                  onClick={() => handleDelete(bus._id)}
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
