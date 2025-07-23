import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface ScheduleDetailsProps {
  schedule: any; // The schedule object passed as a prop
  open: boolean; // Controls dialog visibility
  onOpenChange: (open: boolean) => void; // Callback to change dialog state
}

const ScheduleDetails = ({
  schedule,
  open,
  onOpenChange,
}: ScheduleDetailsProps) => {
  if (!schedule) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[700px] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-start">
            Schedule Details: {schedule.routeName}
          </DialogTitle>
          <DialogDescription>
            Detailed information for schedule {schedule.scheduleId}.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 px-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Schedule ID
            </p>
            <p>{schedule.scheduleId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Route Name
            </p>
            <p>{schedule.routeName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Bus ID</p>
            <p>{schedule.busId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Driver ID
            </p>
            <p>{schedule.driverId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p>{schedule.isActive ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
        <div className="rounded-lg bg-muted">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stop Name</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Departure Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.stops.map((stop: any, index: number) => (
                <TableRow key={`${schedule.scheduleId}-stop-${index}`}>
                  <TableCell>{stop.stopName}</TableCell>
                  <TableCell>{stop.arrivalTime}</TableCell>
                  <TableCell>{stop.departureTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDetails;
