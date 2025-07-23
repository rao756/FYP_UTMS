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
import { Eye, Pencil, Trash2, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import UploadChallanForm from './uploadChallan';

export default function UploadChallanTable() {
  const [challans, setChallans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChallan, setEditingChallan] = useState<any | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/uploaded-challans');
      setChallans(response.data.uploadChallans);
    } catch (error) {
      toast.error('Failed to fetch challans');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await axios.put('/api/uploaded-challans', {
        _id: id,
        challanStatus: 'Paid',
      });
      if (response.status === 200) {
        toast.success('Challan approved');
        fetchChallans();
      }
    } catch (error) {
      toast.error('Error approving challan');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const response = await axios.put('/api/uploaded-challans', {
        _id: id,
        challanStatus: 'Not Paid',
      });
      if (response.status === 200) {
        toast.success('Challan declined');
        fetchChallans();
      }
    } catch (error) {
      toast.error('Error declining challan');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete('/api/uploaded-challans', {
        data: { _id: id },
      });
      if (response.status === 200) {
        toast.success('Challan deactivated');
        fetchChallans();
      }
    } catch (error) {
      toast.error('Error deactivating challan');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-2 md:flex-row md:justify-between">
        <h2 className="text-xl font-semibold leading-none tracking-tight md:text-2xl">
          Uploaded Challans
        </h2>
        <div className="flex gap-2">
          <Button size={'sm'} variant={'secondary'} onClick={fetchChallans}>
            Refresh
          </Button>
        </div>
      </div>

      <Table className="rounded-md border">
        <TableHeader>
          <TableRow>
            <TableHead>Roll No</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {challans.map((challan) => (
            <TableRow key={challan._id}>
              <TableCell>{challan.rollNo}</TableCell>
              <TableCell>{challan.userId._id}</TableCell>
              <TableCell>{challan.challanStatus}</TableCell>
              <TableCell>
                {challan.image && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setViewingImage(challan.image)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Challan Image</DialogTitle>
                      </DialogHeader>
                      <Image
                        src={challan.image}
                        alt="Challan"
                        width={500}
                        height={500}
                        className="w-full object-cover"
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => handleApprove(challan._id)}
                  disabled={challan.challanStatus === 'Paid'}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDecline(challan._id)}
                  disabled={challan.challanStatus === 'Not Paid'}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingChallan(challan)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Challan</DialogTitle>
                    </DialogHeader>
                    <UploadChallanForm
                      defaultValues={editingChallan}
                      onSubmit={async (formData) => {
                        try {
                          const response = await axios.put(
                            '/api/upload-challans',
                            {
                              _id: editingChallan._id,
                              ...Object.fromEntries(formData),
                            }
                          );
                          if (response.status === 200) {
                            toast.success('Challan updated');
                            fetchChallans();
                          }
                        } catch (error) {
                          toast.error('Error updating challan');
                        }
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(challan._id)}
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
