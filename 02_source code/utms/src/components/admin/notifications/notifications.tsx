'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import axios from 'axios';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import NotificationForm from './post-notification';
import Loading from '@/components/loading/loading';
import { Badge } from '@/components/ui/badge';

const Notifications = () => {
  const { data: session, status }: any = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotification, setEditingNotification] = useState<any | null>(
    null
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotifications();
    }
  }, [status]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.notifications);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete('/api/notifications', {
        data: { _id: id },
      });
      if (response.status === 200) {
        toast.success('Notification deactivated');
        fetchNotifications();
      }
    } catch (error) {
      toast.error('Error deactivating notification');
    }
  };

  if (status === 'loading' || !session) {
    return <Loading />;
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex w-full justify-start gap-2">
          <Bell size={20} />
          <span className="hidden md:inline">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-4">
        <SheetHeader className="flex-row items-start justify-between">
          <SheetTitle className="text-2xl font-semibold">
            Notifications
          </SheetTitle>
          <Button variant="outline" size={'sm'} onClick={fetchNotifications}>
            Refresh
          </Button>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loading />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No notifications found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {notifications.map((notification) => (
                <Card
                  key={notification._id}
                  className="flex flex-col border-primary"
                >
                  <CardHeader className="bg-primary/10 !p-2">
                    <div className="flex justify-between">
                      <Badge className="w-max">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </Badge>
                      {session?.user?.type === 'admin' && (
                        <Badge>
                          {notification.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="truncate text-base font-normal capitalize">
                      {notification.notificationMessage}
                    </CardTitle>
                  </CardHeader>

                  {session?.user?.type === 'admin' && (
                    <CardFooter className="mt-auto flex justify-end gap-2 bg-primary/30 !p-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingNotification(notification)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Notification</DialogTitle>
                          </DialogHeader>
                          <NotificationForm
                            defaultValues={editingNotification}
                            onSubmit={async (values) => {
                              try {
                                const response = await axios.put(
                                  '/api/notifications',
                                  {
                                    _id: editingNotification._id,
                                    ...values,
                                  }
                                );
                                if (response.status === 200) {
                                  toast.success('Notification updated');
                                  fetchNotifications();
                                }
                              } catch (error) {
                                toast.error('Error updating notification');
                              }
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(notification._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {session?.user?.type === 'admin' && (
          <SheetFooter className="mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Notification
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Notification</DialogTitle>
                </DialogHeader>
                <NotificationForm
                  onSubmit={async (values) => {
                    try {
                      const response = await axios.post(
                        '/api/notifications',
                        values
                      );
                      if (response.status === 201) {
                        toast.success('Notification created successfully');
                        fetchNotifications();
                      }
                    } catch (error) {
                      toast.error('Error creating notification');
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Notifications;
