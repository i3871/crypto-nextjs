'use client';

import React, {useState, useEffect} from 'react';
import {TrendingDown, BarChart3} from 'lucide-react';
import Papa from "papaparse";
import SymbolsDashboard from "@/components/SymbolsDashboard";
import GoogleSheetEmbed from "@/components/GoogleSheetEmbed";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1uXikZxrJhsAs-ag1qbhNcw8s-eJUu18dYKZWV4QBAuQ/export?format=csv";

export default function ShortsPage() {
    const [symbols, setSymbols] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch(SHEET_URL);
                const csv = await response.text();
                const parsed = Papa.parse<string[]>(csv, {skipEmptyLines: true});

                // Extract symbols from first column
                const symbolsList = parsed.data.map((row) => row[0]);
                setSymbols(symbolsList);
            } catch (error) {
                console.error('Error loading sheet data:', error);
            }
        };

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


                {/* Data Sources */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">


                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <h3 className="text-xl font-bold text-white mb-4">RSI Heatmap</h3>
                        <div className="w-full h-[800px]">
                            <iframe
                                src="https://www.coinglass.com/pro/i/RsiHeatMap"
                                title="RSI Heatmap"
                                className="w-full h-full border-0 rounded"
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Trading Data</h3>
                        <GoogleSheetEmbed
                            sheetUrl="https://docs.google.com/spreadsheets/d/1uXikZxrJhsAs-ag1qbhNcw8s-eJUu18dYKZWV4QBAuQ/edit?usp=sharing"/>
                    </div>
                </div>

                {/* Charts Section - Full Width */}
                <div className="w-full">
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <BarChart3 className="h-6 w-6 text-blue-400"/>
                            <h2 className="text-xl font-semibold text-white">Technical Analysis Charts</h2>
                        </div>

                        <SymbolsDashboard symbols={symbols}/>
                    </div>
                </div>


        </div>
    );
}