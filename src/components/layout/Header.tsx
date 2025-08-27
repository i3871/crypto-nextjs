'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, TrendingDown } from 'lucide-react';

export default function Header() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-400" />
            <Link href="/" className="text-base font-bold text-white">CryptoMonitor</Link>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link href="/shorts" className="bg-red-900 text-red-300 px-3 py-1.5 rounded-lg text-sm hover:bg-red-800 transition-all flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Shorts
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}