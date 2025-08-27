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

  const MetricCard = ({ 
    icon: Icon, 
    title, 
    value, 
    suffix = '', 
    colorClass = 'text-blue-400',
    subtitle = ''
  }: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    value: number | null;
    suffix?: string;
    colorClass?: string;
    subtitle?: string;
  }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`h-6 w-6 ${colorClass}`} />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-sm">Error loading</div>
      ) : (
        <>
          <div className={`text-3xl font-bold ${colorClass} mb-1`}>
            {value !== null ? `${value.toFixed(1)}${suffix}` : 'N/A'}
          </div>
          {subtitle && (
            <div className="text-sm text-gray-400">{subtitle}</div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mb-12">
      <h2 className="text-2xl font-bold text-white text-center mb-8">Market Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={Bitcoin}
          title="BTC Dominance"
          value={metrics.btcDominance}
          suffix="%"
          colorClass="text-orange-400"
        />
        
        <MetricCard
          icon={PieChart}
          title="Altcoin Index"
          value={metrics.altcoinIndex}
          suffix="%"
          colorClass="text-purple-400"
        />
        
        <MetricCard
          icon={Gauge}
          title="Fear & Greed"
          value={metrics.fearGreedIndex}
          colorClass={getFearGreedColor(metrics.fearGreedIndex)}
          subtitle={metrics.fearGreedClassification}
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