'use client';

import React from 'react';
import {TrendingDown, Star, ArrowRight} from 'lucide-react';
import Link from 'next/link';
import CryptoMetrics from "@/components/CryptoMetrics";
import TWCryptoMarketScreener from "@/components/TWCryptoMarketScreener";

export default function Home() {

    return (
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Star className="h-16 w-16 text-yellow-400" strokeWidth={1.5}/>
                        <h1 className="text-5xl font-bold text-white">CryptoMonitor</h1>
                    </div>
                    <p className="text-xl text-gray-300 mb-8">Professional cryptocurrency analytics and trading insights</p>
                    
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <Link href="/shorts" className="bg-red-900 hover:bg-red-800 text-red-300 px-6 py-3 rounded-lg transition-all flex items-center gap-2">
                            <TrendingDown className="h-5 w-5" />
                            Short Opportunities
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <CryptoMetrics/>

                    <div className="flex items-center justify-center gap-4 mb-12">
                        <TWCryptoMarketScreener screenerType={"crypto_mkt"}/>
                        <TWCryptoMarketScreener screenerType={"performance"}/>
                    </div>

                </div>
        </div>
    );
}
