'use client';
import Loading from '@/components/loading/loading';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Check,
  CheckCheck,
  Ellipsis,
  Shield,
  Trash2,
  User,
} from 'lucide-react';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import UserDetailsDialog from './user-details'; // Adjust the import path as needed
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RegisterForm from '@/components/auth/register';
import AdminRegisterForm from '../regiter-admin/regiter-admin';

const Users = () => {
  const { data: session }: any = useSession();
  const [users, setUsers] = useState<any>([]);
  const [openDetails, setOpenDetails] = useState<boolean>(false); // New state for details dialog
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (session?.user) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      console.log(res.data);
      setUsers(res.data.users.filter((user: any) => user.isActive === true));
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (user: any) => {
    try {
      const response = await axios.patch(`/api/users/`, {
        id: user?._id,
      });
      if (response.status === 200) {
        toast.success('User approved successfully');
        fetchUsers();
      } else {
        toast.error('Error approving user request');
      }
    } catch (error) {
      console.error('Error approving user request:', error);
      toast.error('Error approving user request');
    }
  };

  const handleDelete = async (user: any) => {
    try {
      const response = await axios.delete(`/api/users?userId=${user?._id}`);
      if (response.status === 200) {
        toast.success('User deleted successfully');
        setOpenDelete(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error('Error deleting user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  const handleOpenDetails = (user: any) => {
    setSelectedUser(user);
    setOpenDetails(true);
  };

  const handleAdmin = async (user: any) => {
    try {
      const response = await axios.post(`/api/admin/${user?._id}`);
      if (response.status === 201) {
        toast.success('User made admin successfully');
        fetchUsers();
      } else {
        toast.error('Error making user admin');
      }
    } catch (error: any) {
      console.error('Error making user admin:', error?.response?.data?.message);
      toast.error(`${error?.response?.data?.message}`);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4 p-2">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold leading-none tracking-tight md:text-2xl">
          Users
        </h2>
        {session?.user?.type === 'admin' && <AdminRegisterForm />}
      </div>

      <div className="h-[1px] w-full bg-secondary-foreground/10" />

      <div className="rounded-md border">
        <Table className="w-[1000px] lg:w-full">
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Pickup Point</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any, index: number) => (
              <TableRow className="cursor-pointer" key={index}>
                <TableCell
                  onClick={() => handleOpenDetails(user)}
                  className="flex items-center gap-2 capitalize"
                >
                  <Avatar className="size-9">
                    <AvatarImage src={user.image} alt="@shadcn" />
                    <AvatarFallback
                      className={`border ${user.isAdmin ? 'border-primary' : 'border-muted-foreground'} text-muted-foreground`}
                    >
                      <User
                        className={`${user.isAdmin ? 'text-primary' : ''} !size-5`}
                      />
                    </AvatarFallback>
                  </Avatar>
                  <p className="cursor-pointer hover:underline">
                    {user.userName}
                  </p>
                </TableCell>
                <TableCell onClick={() => handleOpenDetails(user)}>
                  {user.departmentName}
                </TableCell>
                <TableCell onClick={() => handleOpenDetails(user)}>
                  {user.pickupStop}
                </TableCell>
                <TableCell onClick={() => handleOpenDetails(user)}>
                  {user.rollNo}
                </TableCell>
                <TableCell onClick={() => handleOpenDetails(user)}>
                  {user.email}
                </TableCell>
                <TableCell className="flex justify-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'secondary'} size={'icon'}>
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          handleAdmin(user);
                        }}
                      >
                        <Button
                          variant={'default'}
                          size={'icon'}
                          className="!size-6"
                        >
                          <Shield />
                        </Button>
                        Make Admin
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenDelete(true);
                        }}
                      >
                        <Button
                          variant={'destructive'}
                          size={'icon'}
                          className="!size-6"
                        >
                          <Trash2 />
                        </Button>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this user?
          </DialogDescription>
          <DialogFooter className="flex justify-end">
            <Button variant={'secondary'} onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button
              variant={'destructive'}
              onClick={() => handleDelete(selectedUser)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <UserDetailsDialog
        user={selectedUser}
        open={openDetails}
        onOpenChange={setOpenDetails}
      />
    </div>
  );
};

export default Users;
