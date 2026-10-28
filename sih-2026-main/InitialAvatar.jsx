import React from 'react';

export default function InitialAvatar({ name, className = 'w-8 h-8' }) {
  const initial = (name || 'User').trim().charAt(0).toUpperCase();

  return (
    <div
      className={`${className} rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold`}
      aria-label={`${name || 'User'} profile`}
    >
      {initial}
    </div>
  );
}
