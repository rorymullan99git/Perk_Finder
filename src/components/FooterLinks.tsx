'use client';

import React from 'react';
import { usePerkStore } from '@/store/usePerkStore';

export const FooterLinks: React.FC = () => {
  const setActiveTab = usePerkStore((s) => s.setActiveTab);
  return (
    <button onClick={() => setActiveTab('method')} className="self-start text-stone-600 underline underline-offset-2 hover:text-stone-900">
      How the ranking works
    </button>
  );
};
