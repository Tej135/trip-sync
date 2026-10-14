import React from 'react';
import { Compass } from 'lucide-react';

const Loader = ({ message = 'Synchronizing travel intelligence...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-brand-500/20 border-t-brand-400 animate-spin" />
        <Compass className="w-8 h-8 text-brand-400 absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400 tracking-wide animate-pulse">{message}</p>
    </div>
  );
};

export default Loader;
