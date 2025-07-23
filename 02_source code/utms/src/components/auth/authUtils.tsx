'use server';
import { signIn } from '@/auth';
import React from 'react';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await signIn('credentials', {
    redirect: false,
    email: email,
    password: password,
  });
};
