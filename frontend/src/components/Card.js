import React from 'react';

export default function Card({ title, subtitle, children }){
  return (
    <div className="p-4 bg-white rounded-lg shadow-card border border-gray-100">
      {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500 mb-2">{subtitle}</p>}
      <div>{children}</div>
    </div>
  );
}
