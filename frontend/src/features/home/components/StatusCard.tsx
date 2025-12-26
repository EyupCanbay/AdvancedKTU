import React from 'react';

interface StatusCardProps {
  value: string;
  label: string;
  color: string;
}

export const StatusCard = ({ value, label, color }: StatusCardProps) => (
  <div className="bg-surface-dark/50 border border-border-dark rounded-lg p-3 flex flex-col gap-1 text-left">
    <div className={`${color} font-bold text-xl font-display`}>{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);