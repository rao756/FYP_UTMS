import LoginForm from '@/components/auth/login';
import React, { Suspense } from 'react';

const LoginPage = async () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;