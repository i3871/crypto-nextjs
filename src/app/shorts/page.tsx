'use client';

import React, {useState, useEffect} from 'react';
import {TrendingDown, BarChart3} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import TradingViewWidget from "@/components/TradingViewWidget";
import SupabaseDataTable, { CryptoSymbol } from "@/components/SupabaseDataTable";
import AddSymbolForm from "@/components/AddSymbolForm";

export default function ShortsPage() {
    const [symbols, setSymbols] = useState<string[]>([]);
    const [cryptoData, setCryptoData] = useState<CryptoSymbol[]>([]);

    const loadData = async () => {
        if (!supabase) {
            console.warn('Supabase not configured');
            return;
        }
        
        try {
            const { data, error } = await supabase
                .from('crypto_symbols')
                .select('id, symbol, created_at, order_index')
                .order('order_index');

            if (error) {
                console.error('Error loading crypto data:', error);
                return;
            }

            if (data) {
                setCryptoData(data);
                const symbolsList = data.map(item => item.symbol);
                setSymbols(symbolsList);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    return (
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingDown className="h-8 w-8 text-red-400"/>
                        <h1 className="text-3xl font-bold text-white">Crypto Shorts Dashboard</h1>
                    </div>
                    <p className="text-gray-300">Identify and analyze cryptocurrency shorting opportunities</p>
                </div>


                {/* RSI Heatmap and Symbols Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                    {/* RSI Heatmap - 2/3 width on large screens */}
                    <div className="xl:col-span-2">
                        <div className="w-full h-[600px]">
                            <iframe
                                src="https://www.coinglass.com/pro/i/RsiHeatMap"
                                title="RSI Heatmap"
                                className="w-full h-full border-0 rounded"
                                loading="lazy"
                            />
                        </div>
                    </div>
                    
                    {/* Symbols - 1/3 width on large screens, full width on small screens */}
                    <div className="xl:col-span-1">
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Crypto Symbols</h3>
                            <AddSymbolForm onSymbolAdded={loadData} />
                            <SupabaseDataTable data={cryptoData} onSymbolRemoved={loadData} onOrderChanged={loadData} />
                        </div>
                    </div>
                </div>

                {/* Charts Section - One per row, full width */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className="h-6 w-6 text-blue-400"/>
                        <h2 className="text-xl font-semibold text-white">Technical Analysis Charts</h2>
                    </div>
                    
                    {symbols.map((symbol) => (
                        <div key={symbol} className="w-full">
                            <TradingViewWidget symbol={`BINANCE:${symbol}`}/>
                        </div>
                    ))}
                </div>


        </div>
    );
}