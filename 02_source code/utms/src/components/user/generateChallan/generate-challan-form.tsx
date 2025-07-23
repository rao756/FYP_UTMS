'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../challanForm.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { JwtPayload } from 'jwt-decode';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

const GenerateChallanForm = ({
  top = 0,
  toggleOpen,
}: {
  top?: number;
  toggleOpen: any;
}) => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [sessionTime, setSessionTime] = useState('Morning');
  const [rollNo, setRollNo] = useState<string>('');
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, top);
  }, [top]);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('/api/routes');
      setRoutes(response.data.routes);
    } catch (error) {
      toast.error('Failed to fetch routes');
    }
  };

  const [challanData, setChallanData] = useState<any>([]); // Type this based on your API response

  // Fetch challan data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/adminChallan/');
        setChallanData(response.data.adminChallan);
      } catch (error) {
        console.error('Error fetching challan data:', error);
      }
    };

    if (session?.user) {
      fetchData();
      setRollNo(session?.user?.rollNo);
    } else {
      toast.error('Error fetching challan!');
    }

    fetchRoutes();
  }, [session?.user]);

  const data = [
    { copy: 'Bank Copy' },
    { copy: 'Student Copy' },
    { copy: 'Treasure Copy' },
    { copy: 'Office Copy' },
  ];


  console.log("-->", session?.user)
  const { handleChange, handleBlur, handleSubmit, values } = useFormik({
    initialValues: {
      name: session?.user?.userName || '',
      fatherName: session?.user?.fatherName || '',
      rollNo: session?.user?.rollNo || '',
      contactNo: '',
      semester: session?.user?.semester || '',
      program: '',
      departmentName: session?.user?.departmentName || '',
      busStop: '',
      route: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      fatherName: Yup.string().required('Father Name is required'),
      rollNo: Yup.string().required('Roll No is required'),
      contactNo: Yup.string().required('Contact No is required'),
      semester: Yup.string().required('Semester is required'),
      program: Yup.string().required('Program is required'),
      departmentName: Yup.string().required('Department is required'),
      busStop: Yup.string().required('Bus Stop is required'),
      route: Yup.string().required('Route is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await axios.post(`/api/challan/${rollNo}`, values);
        if (res.status === 201) {
          toast.success('Challan generated!');
          toggleOpen(false);
        }

        router.refresh();
      } catch (error: any) {
        console.error(error);
        toast.error(error.response.data.err);

        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  console.log(values)


  return !session?.user ? <>loading...</> : (
    <DialogContent className="h-full max-w-[1590px] overflow-y-auto">
      <DialogHeader className="flex w-full justify-between">
        <DialogTitle>Generate Challan</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="mt-4 font-serif">
        <div className="flex flex-wrap justify-center gap-3">
          {data.map((item, i) => (
            <div key={i} className="form-section border border-black">
              <div className="pre-nav flex justify-between border border-b border-black px-2 py-1">
                <span className="bank-copy">{item.copy} </span>
                <span className="sr-no"> Sr. No. </span>
              </div>
              {/* Navbar section  */}
              <div className="navBar flex items-center gap-2 border border-b border-black px-2">
                <div>
                  <img
                    src="/uon.jpeg"
                    className="size-28 object-contain"
                    alt="uon"
                  />
                </div>
                <h4 className="text-xl">UNIVERSITY OF NAROWAL</h4>
              </div>
              {/* Bank title & account  */}
              <div className="bank-content border border-b border-black py-1 text-center">
                <div className="bank-name">The Bank of Punjab</div>
                <div className="account-info">
                  A/C- <span className="fw-light">{challanData.accountNo}</span>
                </div>
              </div>
              {/* User detail and information  */}
              <div className="user-info">
                <div className="border border-b border-black px-2 py-1">
                  <label htmlFor="">Name: </label>
                  <input
                    className="inputt"
                    type="text"
                    name="name"
                    required
                    onChange={handleChange}
                    value={values.name}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="border border-b border-black px-2 py-1">
                  <label htmlFor="">Father Name: </label>
                  <input
                    type="text"
                    name="fatherName"
                    className="inputt"
                    required
                    onChange={handleChange}
                    value={values.fatherName}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="border border-b border-black px-2 py-1">
                  <label htmlFor="">Roll No: </label>
                  <input
                    type="text"
                    name="rollNo"
                    className="inputt"
                    onChange={handleChange}
                    value={values.rollNo}
                    onBlur={handleBlur}
                  />{' '}
                </div>
                <div className="border border-b border-black px-2 py-1">
                  <label htmlFor="">Contact No: </label>
                  <input
                    name="contactNo"
                    className="inputt"
                    onChange={handleChange}
                    value={values.contactNo}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="flex gap-1 border border-b border-black px-2 py-1">
                  <label htmlFor="">Semester: </label>
                  <input
                    type="text"
                    className="ouline-none"
                    name="semester"
                    onChange={handleChange}
                    value={values.semester}
                    onBlur={handleBlur}
                  />
                  <span className="morning g">{challanData.session}</span>
                </div>
                <div className="flex border border-b border-black px-2 py-1">
                  <label htmlFor="">Program: </label>
                  <input
                    type="text"
                    className="inputt"
                    name="program"
                    onChange={handleChange}
                    value={values.program}
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    className={sessionTime.toLowerCase()}
                    onClick={() =>
                      setSessionTime((prev) =>
                        prev === 'Morning' ? 'Evening' : 'Morning'
                      )
                    }
                  >
                    {sessionTime}
                  </button>
                </div>
                <div className="border border-b border-black px-2 py-1">
                  <label htmlFor="">Department: </label>
                  <input
                    type="text"
                    name="departmentName"
                    className="inputt"
                    required
                    onChange={handleChange}
                    value={values.departmentName}
                    onBlur={handleBlur}
                  />{' '}
                </div>
                <div className="grid grid-cols-2 content-between gap-2 border border-b border-black px-2 py-1">
                  <div className="flex w-full items-start">
                    <label htmlFor="route">Route: </label>
                    <select
                      name="route"
                      className="border bg-transparent"
                      required
                      onChange={handleChange}
                      value={values.route}
                      onBlur={handleBlur}
                    >
                      <option value="">Select route</option>
                      {routes.map((route, i) => (
                        <option key={i} value={route.routeName}>
                          {route?.routeName}
                        </option>
                      ))}
                      {/* <option value="Narang">Narang</option>
                      <option value="Pasrur">Pasrur</option>
                      <option value="Kot Abdullah">Kot Abdullah</option>
                      <option value="Zafawal">Zafarwal</option>
                      <option value="Shakargarh">Shakargarh</option> */}
                    </select>
                  </div>
                  <div className="flex w-full items-start gap-2">
                    <label htmlFor="busStop">Bus Stop: </label>
                    <input
                      type="text"
                      name="busStop"
                      className="w-[50px]"
                      required
                      onChange={handleChange}
                      value={values.busStop}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              </div>
              <div>
                {/* Fees detail  */}
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Particulars</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Transport Fee</td>
                      <td className="text-center">{challanData.amount}/-</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="fw-bold">Grand Total</td>
                      <td className="fw-bold text-center">
                        {challanData.amount}/-
                      </td>
                    </tr>
                    <tr></tr>
                  </tbody>
                </table>
              </div>

              <div>
                <p className="border border-b border-black p-2 text-center">
                  Amount Fifteen thousand Only/-
                </p>
              </div>
              <div>
                <p className="fs-7 border border-b border-black p-2 text-center">
                  <b>Fee Submisstion Date:</b> {challanData.issueDate}{' '}
                  <b> to</b> {challanData.lastDate}
                </p>
              </div>
              <div>
                <p className="border border-b border-black p-2 text-start">
                  <b>Note:</b> Challan after due date will not be accepted.
                  Student has the responsibility to retain challan copy till
                  completion of degree.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-3 text-center">
          <Button type="submit">
            {loading ? 'Loading...' : 'Generate Challan'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default GenerateChallanForm;
