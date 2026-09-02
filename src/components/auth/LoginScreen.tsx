import React, { useState } from 'react';
import { LandingPage } from '../landing/LandingPage';
import { RuduLoginWindow } from './RuduLoginWindow';

export const LoginScreen: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login'>('landing');

  if (view === 'login') {
    return <RuduLoginWindow forcedRole="farmer" onBack={() => setView('landing')} />;
  }

  return (
    <LandingPage 
      onOpenLogin={() => setView('login')} 
    />
  );
};
