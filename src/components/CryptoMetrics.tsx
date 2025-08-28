'use client';

import React, { useState, useEffect } from 'react';
import { Bitcoin, PieChart, Gauge } from 'lucide-react';

interface CryptoMetrics {
  btcDominance: number | null;
  altcoinIndex: number | null;
  fearGreedIndex: number | null;
  fearGreedClassification: string;
}

export default function CryptoMetrics() {
  const [metrics, setMetrics] = useState<CryptoMetrics>({
    btcDominance: null,
    altcoinIndex: null,
    fearGreedIndex: null,
    fearGreedClassification: 'Loading...'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch BTC dominance from CoinGecko
      const dominanceResponse = await fetch('https://api.coingecko.com/api/v3/global');
      const dominanceData = await dominanceResponse.json();
      const btcDominance = dominanceData?.data?.market_cap_percentage?.btc || null;
      
      // Calculate altcoin index (100 - BTC dominance)
      const altcoinIndex = btcDominance ? 100 - btcDominance : null;
      
      // Fetch Fear & Greed Index
      const fearGreedResponse = await fetch('https://api.alternative.me/fng/?limit=1');
      const fearGreedData = await fearGreedResponse.json();
      const fearGreedIndex = fearGreedData?.data?.[0]?.value ? parseInt(fearGreedData.data[0].value) : null;
      const fearGreedClassification = fearGreedData?.data?.[0]?.value_classification || 'Unknown';

      setMetrics({
        btcDominance,
        altcoinIndex,
        fearGreedIndex,
        fearGreedClassification
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching crypto metrics:', err);
      setError('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  const getFearGreedColor = (value: number | null) => {
    if (value === null) return 'text-gray-400';
    if (value <= 25) return 'text-red-400';
    if (value <= 50) return 'text-orange-400';
    if (value <= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  // Circular Progress Component
  const CircularProgress = ({ value, color, size = 80 }: { value: number; color: string; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgb(55, 65, 81)"
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold`} style={{ color }}>
            {value.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  // Speedometer Component for Fear & Greed
  const Speedometer = ({ value, color }: { value: number; color: string }) => {
    const angle = (value / 100) * 180 - 90; // Convert 0-100 to -90 to +90 degrees
    
    return (
      <div className="relative w-24 h-20 flex flex-col items-center">
        <svg width="80" height="50" className="overflow-visible">
          {/* Background arc */}
          <path
            d="M 10 40 A 30 30 0 0 1 70 40"
            fill="none"
            stroke="rgb(55, 65, 81)"
            strokeWidth="6"
          />
          {/* Colored arc based on value */}
          <path
            d="M 10 40 A 30 30 0 0 1 70 40"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray="94.2"
            strokeDashoffset={94.2 - (value / 100) * 94.2}
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        {/* Needle */}
        <div 
          className="absolute top-10 left-1/2 w-0.5 h-5 bg-white origin-bottom transform -translate-x-1/2 transition-transform duration-500"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        />
        <div className="absolute top-14 left-1/2 w-1.5 h-1.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        <div className="text-center mt-3">
          <span className={`text-base font-bold`} style={{ color }}>
            {value}
          </span>
        </div>
      </div>
    );
  };

  const MetricCard = ({ 
    icon: Icon, 
    title, 
    value, 
    suffix = '', 
    colorClass = 'text-blue-400',
    subtitle = '',
    type = 'default'
  }: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    value: number | null;
    suffix?: string;
    colorClass?: string;
    subtitle?: string;
    type?: 'circular' | 'speedometer' | 'default';
  }) => {
    const getColor = () => {
      if (colorClass === 'text-orange-400') return 'rgb(251, 146, 60)';
      if (colorClass === 'text-purple-400') return 'rgb(196, 181, 253)';
      if (colorClass === 'text-red-400') return 'rgb(248, 113, 113)';
      if (colorClass === 'text-orange-400') return 'rgb(251, 146, 60)';
      if (colorClass === 'text-yellow-400') return 'rgb(250, 204, 21)';
      if (colorClass === 'text-green-400') return 'rgb(74, 222, 128)';
      return 'rgb(96, 165, 250)';
    };

    return (
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all hover:bg-gray-800/70 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`h-5 w-5 ${colorClass}`} />
          <h3 className="text-base font-semibold text-white truncate">{title}</h3>
        </div>
        
        {loading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-xs">Error loading</div>
        ) : (
          <div className="flex flex-col items-center">
            {type === 'circular' && value !== null ? (
              <CircularProgress value={value} color={getColor()} />
            ) : type === 'speedometer' && value !== null ? (
              <Speedometer value={value} color={getColor()} />
            ) : (
              <div className={`text-2xl font-bold ${colorClass} mb-1`}>
                {value !== null ? `${value.toFixed(1)}${suffix}` : 'N/A'}
              </div>
            )}
            {subtitle && (
              <div className="text-xs text-gray-400 truncate mt-2">{subtitle}</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto mb-12">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={Bitcoin}
          title="BTC Dominance"
          value={metrics.btcDominance}
          suffix="%"
          colorClass="text-orange-400"
          type="circular"
        />
        
        <MetricCard
          icon={PieChart}
          title="Altcoin Index"
          value={metrics.altcoinIndex}
          suffix="%"
          colorClass="text-purple-400"
          type="circular"
        />
        
        <MetricCard
          icon={Gauge}
          title="Fear & Greed"
          value={metrics.fearGreedIndex}
          colorClass={getFearGreedColor(metrics.fearGreedIndex)}
          subtitle={metrics.fearGreedClassification}
          type="speedometer"
        />
      </div>
      
      {error && (
        <div className="text-center mt-4">
          <button 
            onClick={fetchMetrics}
            className="text-blue-400 hover:text-blue-300 text-sm underline"
          >
            Retry loading metrics
          </button>
        </div>
      )}
    </div>
  );
}