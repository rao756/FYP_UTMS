import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface UserDetailsDialogProps {
  user: any; // The user object passed as a prop
  open: boolean; // Controls dialog visibility
  onOpenChange: (open: boolean) => void; // Callback to change dialog state
}

const UserDetailsDialog = ({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogDescription>Details for {user.userName}</DialogDescription>
          {/* User Avatar and Name */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.image} alt={user.userName} />
              <AvatarFallback className="border-2 border-muted-foreground text-muted-foreground">
                <User />
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="capitalize">{user.userName}</DialogTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          {/* User Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Father&apos;s Name</p>
              <p className="text-sm">{user.fatherName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Roll Number</p>
              <p className="text-sm">{user.rollNo}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Department</p>
              <p className="text-sm">{user.departmentName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Semester</p>
              <p className="text-sm">{user.semester}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Route Name</p>
              <p className="text-sm">{user.routeName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Pickup Stop</p>
              <p className="text-sm">{user.pickupStop}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Challan Status</p>
              <p className="text-sm">{user.challanStatus}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Active Status</p>
              <p className="text-sm">{user.isActive ? 'Active' : 'Inactive'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Created At</p>
              <p className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Updated At</p>
              <p className="text-sm">
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            size={'sm'}
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
