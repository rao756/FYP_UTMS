'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { toast } from 'sonner';
import axios from 'axios';
import ScheduleDetails from '../site/schedules/schedule-details';
import { Button } from '../ui/button';
import Stats from '../admin/stats/stats';

const DashboardHome = () => {
  const { data: session }: any = useSession();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      fetchSchedules();
    }
  }, [session?.user]);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get('/api/schedules');
      setSchedules(
        res.data.schedules
          .sort((a: any, b: any) => b.stops.length - a.stops.length)
          .slice(0, 5)
      );
    } catch (error) {
      toast.error('Failed to fetch schedules');
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <div className="flex h-full items-center justify-center py-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Loading schedules...</span>
    </div>
  ) : (
    <div className="space-y-4 p-2">
      {session?.user?.type === 'admin' && (
        <>
          <div className="flex w-full items-center justify-between">
            <h2 className="flex w-full items-center justify-center gap-2 text-center text-xl capitalize leading-none tracking-tight md:text-2xl">
              Welcome to{' '}
              <span className="title-font hidden bg-gradient-to-r from-[#79e946] to-primary bg-clip-text text-xl font-bold tracking-normal text-transparent md:inline md:text-start md:text-3xl">
                {' '}
                UTMS
              </span>
              {/* <span className="font-semibold capitalize">
                {session?.user?.userName}
              </span> */}
            </h2>

            <div className="flex items-center gap-2">
              {/* <Bell className="mx-4" />
              <p className="grid h-10 w-10 place-content-center rounded-full border border-primary bg-primary/20">
                <User />
              </p> */}
            </div>
          </div>

          <div className="h-[1px] w-full bg-secondary-foreground/10" />

          <Stats />

          <div className="h-[1px] w-full bg-secondary-foreground/10" />
        </>
      )}

      {/* schedules */}
      <div>
        <h2 className="text-xl font-semibold capitalize leading-none tracking-tight md:text-2xl">
          Schedules
        </h2>

        <div className="mt-4 rounded-md border">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Schedule ID</TableHead>
                <TableHead>Route Name</TableHead>
                <TableHead>Bus ID</TableHead>
                <TableHead>Stops</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((route) => (
                <TableRow key={route.scheduleId}>
                  <TableCell>
                    {route.scheduleId}{' '}
                    <Button
                      variant="outline"
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Schedule Details Dialog */}
      <ScheduleDetails
        schedule={selectedSchedule}
        open={openDetails}
        onOpenChange={setOpenDetails}
      />
    </div>
  );
};

export default DashboardHome;
