'use client';

import React from 'react';
import {TrendingDown, Star, ArrowRight} from 'lucide-react';
import Link from 'next/link';
import CryptoMetrics from "@/components/CryptoMetrics";
import TWCryptoMarketScreener from "@/components/TWCryptoMarketScreener";
import TWStories from "@/components/TWStories";

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

                    <div className="mb-16 space-y-8">
                        <div className="max-w-7xl mx-auto">
                            <h2 className="text-2xl font-bold text-white text-center mb-8">Latest News</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <TWStories type="market" market="crypto" />
                                <TWStories type="market" market="stock" />
                                <TWStories type="market" market="index" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white text-center mb-8">Market Analysis</h2>
                        
                        {/* Row 1: Market Overview - Large */}
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                                <h3 className="text-xl font-semibold text-white mb-6 text-center">Market Overview</h3>
                                <TWCryptoMarketScreener defaultColumn={"overview"}/>
                            </div>
                        </div>

                        {/* Row 2: Performance - Large */}
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                                <h3 className="text-xl font-semibold text-white mb-6 text-center">Performance</h3>
                                <TWCryptoMarketScreener defaultColumn={"performance"}/>
                            </div>
                        </div>


                    </div>

                </div>
        </div>
    );
}
