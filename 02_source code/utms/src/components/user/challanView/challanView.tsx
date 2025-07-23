'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

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

interface ChallanViewProps {
  challan: Challan;
}

const ChallanView = ({ challan }: ChallanViewProps) => {
  const router = useRouter();
  const [adminChallan, setAdminChallan] = useState<any>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAdminChallan = async () => {
      try {
        const response = await axios.get('/api/adminChallan/');
        setAdminChallan(response.data.adminChallan);
      } catch (error) {
        console.error('Error fetching admin challan data:', error);
        toast.error('Failed to load admin challan data');
      }
    };
    fetchAdminChallan();
  }, []);

  const generatePDF = async () => {
    try {
      // Update download status
      const updateResponse = await axios.patch(
        `/api/challan/${challan.rollNo}`,
        {
          downloadStatus: 'downloaded',
        }
      );
      console.log('Update Response:', updateResponse.data);
      toast.success('Challan download status updated successfully');

      // Generate PDF
      const input = componentRef.current;
      if (input) {
        const canvas = await html2canvas(input, {
          scale: 2,
          useCORS: true,
          logging: true,
        });
        console.log('Canvas dimensions:', canvas.width, canvas.height);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgScaledWidth = imgWidth * ratio;
        const imgScaledHeight = imgHeight * ratio;
        const imgX = (pdfWidth - imgScaledWidth) / 2;
        const imgY = 10;

        pdf.addImage(
          imgData,
          'PNG',
          imgX,
          imgY,
          imgScaledWidth,
          imgScaledHeight
        );
        pdf.save(
          `challan_${challan.rollNo}_${new Date().toISOString().split('T')[0]}.pdf`
        );
      } else {
        console.error('Component ref is null');
        toast.error('Failed to capture challan content');
      }
    } catch (error: any) {
      console.error('Error generating PDF or updating challan:', error);
      toast.error(
        error.response?.data?.message ||
          'Failed to generate PDF or update challan'
      );
    }
  };

  const data = [
    { copy: 'Bank Copy' },
    { copy: 'Student Copy' },
    { copy: 'Treasure Copy' },
    { copy: 'Office Copy' },
  ];

  const challanData = adminChallan || {
    accountNo: '1234567890',
    session: 'Morning',
    amount: '15000',
    issueDate: '2025-04-01',
    lastDate: '2025-04-15',
  };

  return (
    <DialogContent className="h-full max-w-[1480px] overflow-y-auto !bg-white !text-black">
      <DialogHeader className="w-full flex-row items-center justify-between">
        <DialogTitle>View Challan</DialogTitle>
        <Button size="sm" onClick={generatePDF}>
          Download Challan
        </Button>
      </DialogHeader>

      <div ref={componentRef} id="challan-content" className="mt-4 font-serif">
        <div className="flex flex-wrap justify-center gap-3">
          {data.map((item, i) => (
            <div key={i} className="form-section border border-black">
              <div className="pre-nav flex justify-between border-b border-black p-1">
                <span className="bank-copy font-bold">{item.copy}</span>
                <span className="sr-no font-bold">
                  Sr. No. {challan.SrNo || i + 1}
                </span>
              </div>
              <div className="navBar flex items-center gap-2 border-b border-black p-2">
                <div>
                  <img
                    src="/uon.jpeg"
                    className="h-20 w-20 object-contain"
                    alt="uon"
                  />
                </div>
                <h4 className="text-xl font-bold">UNIVERSITY OF NAROWAL</h4>
              </div>
              <div className="bank-content border-b border-black p-2 text-center">
                <div className="bank-name font-semibold">
                  The Bank of Punjab
                </div>
                <div className="account-info">
                  A/C- <span className="fw-light">{challanData.accountNo}</span>
                </div>
              </div>
              <div className="user-info">
                <div className="border-b border-black p-2">
                  <span className="font-semibold">Name: </span>
                  <span>{challan.name}</span>
                </div>
                <div className="border-b border-black p-2">
                  <span className="font-semibold">Father Name: </span>
                  <span>{challan.fatherName}</span>
                </div>
                <div className="border-b border-black p-2">
                  <span className="font-semibold">Roll No: </span>
                  <span>{challan.rollNo}</span>
                </div>
                <div className="border-b border-black p-2">
                  <span className="font-semibold">Contact No: </span>
                  <span>{challan.contactNo}</span>
                </div>
                <div className="flex gap-1 border-b border-black p-2">
                  <span className="font-semibold">Semester: </span>
                  <span>{challan.semester}</span>
                </div>
                <div className="flex gap-1 border-b border-black p-2">
                  <span className="font-semibold">Program: </span>
                  <span>{challan.program}</span>
                  <span className={challanData.session.toLowerCase()}>
                    {challanData.session}
                  </span>
                </div>
                <div className="border-b border-black p-2">
                  <span className="font-semibold">Department: </span>
                  <span>{challan.departmentName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-black p-2">
                  <div>
                    <span className="font-semibold">Route: </span>
                    <span>{challan.route}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold">Bus Stop: </span>
                    <span>{challan.busStop}</span>
                  </div>
                </div>
              </div>
              <div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="border-r border-black px-2 py-1 text-left">
                        Sr.
                      </th>
                      <th className="border-r border-black px-2 py-1 text-left">
                        Particulars
                      </th>
                      <th className="px-2 py-1 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="border-r border-black px-2 py-1">1</td>
                      <td className="border-r border-black px-2 py-1">
                        Transport Fee
                      </td>
                      <td className="px-2 py-1 text-right">
                        {challanData.amount}/-
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="border-r border-black px-2 py-1 font-bold">
                        Grand Total
                      </td>
                      <td className="px-2 py-1 text-right font-bold">
                        {challanData.amount}/-
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="border-t border-black p-2 text-center">
                <p>Amount Fifteen Thousand Only/-</p>
              </div>
              <div className="border-t border-black p-2 text-center">
                <p className="text-sm">
                  <b>Fee Submission Date:</b> {challanData.issueDate} <b>to</b>{' '}
                  {challanData.lastDate}
                </p>
              </div>
              <div className="border-t border-black p-2 text-left">
                <p className="text-sm">
                  <b>Note:</b> Challan after due date will not be accepted.
                  Student has the responsibility to retain challan copy till
                  completion of degree.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  );
};

export default ChallanView;
