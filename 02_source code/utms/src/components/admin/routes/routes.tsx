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
import RouteForm from './addRoute';

export default function RouteTable() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoute, setEditingRoute] = useState<any | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/routes');
      setRoutes(response.data.routes);
    } catch (error) {
      toast.error('Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete('/api/routes', { data: { _id: id } });
      if (response.status === 200) {
        toast.success('Route deactivated');
        fetchRoutes();
      }
    } catch (error) {
      toast.error('Error deactivating route');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-2 md:flex-row md:justify-between">
        <h2 className="text-xl font-semibold leading-none tracking-tight md:text-2xl">
          Routes
        </h2>
        <div className="flex gap-2">
          <Button size={'sm'} variant={'secondary'} onClick={fetchRoutes}>
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size={'sm'}>Add Route</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Route</DialogTitle>
                <DialogDescription>
                  Enter details to add a new route.
                </DialogDescription>
              </DialogHeader>
              <RouteForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table className="rounded-md border">
        <TableHeader>
          <TableRow>
            <TableHead>Route ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route._id}>
              <TableCell>{route.routeId}</TableCell>
              <TableCell>{route.routeName}</TableCell>
              <TableCell>{route.isActive ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingRoute(route)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Route</DialogTitle>
                    </DialogHeader>
                    <RouteForm
                      defaultValues={editingRoute}
                      onSubmit={async (values) => {
                        try {
                          const response = await axios.put('/api/routes', {
                            _id: editingRoute._id,
                            ...values,
                          });
                          if (response.status === 200) {
                            toast.success('Route updated');
                            fetchRoutes();
                          }
                        } catch (error) {
                          toast.error('Error updating route');
                        }
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  className="ml-2"
                  onClick={() => handleDelete(route._id)}
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
