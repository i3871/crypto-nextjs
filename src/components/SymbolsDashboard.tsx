"use client";

import React from "react";
import TradingViewWidget from "./TradingViewWidget";
import TWStories from "@/components/TWStories";

interface SymbolsDashboardProps {
    symbols: string[];
}

export default function SymbolsDashboard({ symbols }: SymbolsDashboardProps) {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-4">
            {symbols.map((symbol) => (
                <div key={symbol} className="w-full">
                    <TradingViewWidget symbol={`BINANCE:${symbol}`}/>
                    <TWStories type="symbol" symbol={`BINANCE:${symbol}`}/>
                </div>
            ))}
        </div>
    );
}