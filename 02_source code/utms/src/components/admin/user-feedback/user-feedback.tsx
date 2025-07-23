'use client';
import Loading from '@/components/loading/loading';
import { useSession } from 'next-auth/react';
import React from 'react';

const UserFeedback = () => {
  const { data: session }: any = useSession();
  if (!session) return <Loading />;

  return (
    <div>
      <h2 className="text-2xl font-semibold leading-none tracking-tight">
        User Feedback
      </h2>
    </div>
  );
};

export default UserFeedback;
