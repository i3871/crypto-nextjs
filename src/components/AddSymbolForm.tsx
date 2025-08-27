'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AddSymbolFormProps {
  onSymbolAdded: () => void;
}

export default function AddSymbolForm({ onSymbolAdded }: AddSymbolFormProps) {
  const [symbol, setSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !supabase) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('crypto_symbols')
        .insert([{ symbol: symbol.toUpperCase().trim() }]);

      if (error) {
        console.error('Error adding symbol:', error);
        return;
      }

      setSymbol('');
      onSymbolAdded();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter symbol (e.g., BTCUSDT)"
        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !symbol.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {isLoading ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}