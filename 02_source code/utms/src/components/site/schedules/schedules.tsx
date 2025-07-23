'use client';
import Loading from '@/components/loading/loading';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import axios from 'axios';
import { toast } from 'sonner';
import SchedulesFormDialog from './schedules-form';
import ScheduleDetails from './schedule-details'; // New component
import Link from 'next/link';

const Schedules = () => {
  const { data: session }: any = useSession();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openScheduleDialog, setOpenScheduleDialog] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleOpenForm = (schedule?: any) => {
    setSelectedSchedule(schedule || null);
    setOpenScheduleDialog(true);
  };

  useEffect(() => {
    if (session?.user) {
      fetchSchedules();

      session.user?.type === 'admin' ? setIsAdmin(true) : setIsAdmin(false);
    }
  }, [session]);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get('/api/schedules');
      setSchedules(
        res.data.schedules.sort(
          (a: any, b: any) => b.stops.length - a.stops.length
        )
      );
    } catch (error) {
      toast.error('Failed to fetch schedules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (schedule: any) => {
    try {
      const response = await axios.delete(
        `/api/schedules?scheduleId=${schedule?.scheduleId}` // Use scheduleId as per API
      );
      if (response.status === 200) {
        toast.success('Schedule deleted successfully');
        setSchedules((prev) =>
          prev.filter((s) => s.scheduleId !== schedule.scheduleId)
        );
        setOpenDelete(false);
        setSelectedSchedule(null);
      } else {
        toast.error('Error deleting schedule');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Error deleting schedule');
    }
  };

  const handleFormClose = (open: boolean, updatedSchedule?: any) => {
    setOpenScheduleDialog(open);
    if (updatedSchedule) {
      setSchedules((prev) =>
        prev.some((s) => s.scheduleId === updatedSchedule.scheduleId)
          ? prev.map((s) =>
              s.scheduleId === updatedSchedule.scheduleId ? updatedSchedule : s
            )
          : [...prev, updatedSchedule].sort(
              (a, b) => b.stops.length - a.stops.length
            )
      );
    }
    setSelectedSchedule(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4 p-2">
      <div className="flex flex-col items-start gap-2 md:flex-row md:justify-between">
        <h2 className="text-xl font-semibold leading-none tracking-tight md:text-2xl">
          Schedules
        </h2>
        {session?.user?.type == 'admin' && (
          <div className="flex flex-wrap gap-2">
            <Link href={'/admin/routes'}>
              <Button variant={'outline'} size="sm">
                Routes
              </Button>
            </Link>{' '}
            <Link href={'/admin/buses'}>
              <Button variant={'outline'} size="sm">
                Buses
              </Button>
            </Link>
            <Link href={'/admin/drivers'}>
              <Button variant={'outline'} size="sm">
                Drivers
              </Button>
            </Link>
            <Button size="sm" onClick={() => handleOpenForm()}>
              Add Schedule
            </Button>
          </div>
        )}
      </div>
      <div className="h-[1px] w-full bg-secondary-foreground/10" />

      <div className="rounded-md border">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Schedule ID</TableHead>
              <TableHead>Route Name</TableHead>
              <TableHead>Bus ID</TableHead>
              <TableHead>Stops</TableHead>
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((route) => (
              <TableRow key={route.scheduleId}>
                <TableCell>
                  {route.scheduleId}{' '}
                  <Button
                    variant="link"
                    size="icon"
                    onClick={() => {
                      setSelectedSchedule(route);
                      setOpenDetails(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>{' '}
                </TableCell>
                <TableCell>{route.routeName}</TableCell>
                <TableCell>{route.busId}</TableCell>
                <TableCell>{route.stops.length}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          setSelectedSchedule(route);
                          setOpenScheduleDialog(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setSelectedSchedule(route);
                          setOpenDelete(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Schedule Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete {selectedSchedule?.routeName}?
          </DialogDescription>
          <DialogFooter className="flex justify-end">
            <Button variant="secondary" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(selectedSchedule)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedules Form Dialog */}
      <SchedulesFormDialog
        schedule={selectedSchedule}
        open={openScheduleDialog}
        onOpenChange={handleFormClose}
      />

      {/* Schedule Details Dialog */}
      <ScheduleDetails
        schedule={selectedSchedule}
        open={openDetails}
        onOpenChange={setOpenDetails}
      />
    </div>
  );
};

export default Schedules;
