'use client';

import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingSpinner: React.FC = () => {
  const size = 50;
  const color = '#ffffff'; // Changed to white for better visibility on semi-transparent background

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <ClipLoader size={size} color={color} />
    </div>
  );
};

export default LoadingSpinner;
