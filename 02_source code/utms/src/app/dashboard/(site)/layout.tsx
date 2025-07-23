import { Card } from '@/components/ui/card';
import Sidebar from '@/components/site/sidebar/sidebar';
import React from 'react';

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="app-bg flex h-screen w-full items-center">
      <div className="mx-auto flex h-full w-full gap-2 rounded-xl p-2 md:gap-3">
        <Sidebar />

        <Card
          className={`w-[calc(100%_-_80px)] overflow-y-auto bg-card/90 p-2 md:w-[calc(100%_-_300px)] md:p-4`}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
