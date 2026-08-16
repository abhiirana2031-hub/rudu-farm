"use client";
import React, { useState, useEffect } from 'react';
import { useFarm } from '@/context/FarmContext';
import { LandingPage } from '@/views/LandingPage';
import { AuthModal } from '@/components/AuthModal';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const { currentUser, currentRole } = useFarm();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      // Redirect based on role
      if (currentRole === 'admin') router.push('/admin');
      else if (currentRole === 'employee') router.push('/operator');
      else if (currentRole === 'farmer') router.push('/farmer');
    }
  }, [currentUser, currentRole, router]);

  if (currentUser) return null; // Let the effect redirect

  return (
    <div className="app-wrapper">
      <LandingPage />
      <AuthModal />
    </div>
  );
}
