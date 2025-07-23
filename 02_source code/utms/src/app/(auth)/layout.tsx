import React from 'react';

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-image flex h-screen">
      <div className="lg:w-1/2 xl:w-2/3"></div>
      <div className="flex h-full w-full items-center bg-white/80 lg:w-1/2 lg:rounded-l-3xl xl:w-1/3">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
