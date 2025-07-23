'use client';
import Loading from '@/components/loading/loading';
import { useSession } from 'next-auth/react';
import React from 'react';
import UpdateChallanForm from './update-challan-form';

const UpdateChalan = () => {
  const { data: session }: any = useSession();

  if (!session) return <Loading />;

  return (
    <div>
      <UpdateChallanForm />
    </div>
  );
};

export default UpdateChalan;
