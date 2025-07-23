'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import GenerateChallanForm from './generate-challan-form';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ChallanView from '../challanView/challanView';

interface Challan {
  SrNo?: number;
  busStop: string;
  contactNo: string;
  createdAt: string;
  departmentName: string;
  downloadStatus: string;
  fatherName: string;
  name: string;
  program: string;
  rollNo: string;
  route: string;
  semester: string;
  _id: string;
}

const ChallanForm = () => {
  const { data: session }: any = useSession();
  const [openGenerateDialog, setOpenGenerateDialog] = useState<boolean>(false); // For GenerateChallanForm
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false); // For ChallanView
  const [viewChallan, setViewChallan] = useState<Challan | null>(null); // State for the challan to view
  const [challans, setChallans] = useState<Challan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (rollNo: string) => {
      try {
        const response = await axios.get(`/api/challan/${rollNo}`);
        console.log(response.data.challans);
        setChallans(response.data.challans);
      } catch (error: any) {
        console.error('Error fetching challan data:', error);
        toast.error(
          'Error fetching challan!',
          error.response?.data?.message || 'An error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    if (session?.user && session.user.rollNo) {
      fetchData(session.user.rollNo);
    }
  }, [session?.user]);

  const handleViewChallan = (challan: Challan) => {
    setViewChallan(challan);
    setOpenViewDialog(true); // Open the view dialog
  };

  return loading ? (
    <div className="flex h-full items-center justify-center py-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Loading challans...</span>
    </div>
  ) : (
    <>
      {/* Dialog for Generate Challan */}
      <Dialog open={openGenerateDialog} onOpenChange={setOpenGenerateDialog}>
        <div className="flex flex-col items-start gap-2 md:flex-row md:justify-between">
          <h2 className="text-xl font-semibold leading-none tracking-tight md:text-2xl">
            Recent Challans
          </h2>
          <DialogTrigger asChild>
            <Button variant={'default'} size={'sm'} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Generate Challan
            </Button>
          </DialogTrigger>
        </div>
        <GenerateChallanForm toggleOpen={() => setOpenGenerateDialog(false)} />
      </Dialog>

      {/* Challan Table */}
      {challans.length === 0 ? (
        <p className="py-4 text-center text-gray-500">No challans found.</p>
      ) : (
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Bus Stop</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challans.map((challan, index) => (
                <TableRow key={challan._id}>
                  <TableCell>{challan.SrNo || index + 1}</TableCell>
                  <TableCell>{challan.name}</TableCell>
                  <TableCell>{challan.rollNo}</TableCell>
                  <TableCell>{challan.departmentName}</TableCell>
                  <TableCell>{challan.route}</TableCell>
                  <TableCell>{challan.busStop}</TableCell>
                  <TableCell>
                    {new Date(challan.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {/* Dialog for View Challan */}
                    <Dialog
                      open={openViewDialog && viewChallan?._id === challan._id}
                      onOpenChange={setOpenViewDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewChallan(challan)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {viewChallan && <ChallanView challan={viewChallan} />}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default ChallanForm;
