'use client';

import React, { useState, useEffect } from 'react';
import CryptoMetrics from "@/components/CryptoMetrics";
import TWCryptoMarketScreener from "@/components/TWCryptoMarketScreener";
import TWStories from "@/components/TWStories";
import TWTickerTape from "@/components/TWTickerTape";

interface CoinData {
    id: string;
    symbol: string;
    name: string;
}

export default function Home() {
    const [tickerSymbols, setTickerSymbols] = useState([
        { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
    ]);

    useEffect(() => {
        const fetchTopCryptos = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false');
                const data: CoinData[] = await response.json();

                // Filter out common stablecoins
                const excludecoins = ['steth', 'wsteth','hype', 'weeth', 'wbtc', 'wbeth','weth', 'usdt', 'usdc','usde', 'busd', 'dai', 'frax', 'tusd', 'usdp', 'usdd', 'fei', 'gusd'];
                const filteredData = data.filter(coin => !excludecoins.includes(coin.symbol.toLowerCase()));

                const symbols = filteredData.slice(0, 30).map(coin => ({
                    proName: `BINANCE:${coin.symbol.toUpperCase()}USDT`,
                    title: coin.name
                }));

                setTickerSymbols(symbols);
            } catch (error) {
                console.error('Error fetching top cryptos:', error);
            }
        };

        void fetchTopCryptos();
    }, []);

    return (
        <>
            {/* Ticker Tape - Full Width */}
            <div className="w-full mb-8">
                <TWTickerTape symbols={tickerSymbols} />
            </div>
        
            <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">

                    <CryptoMetrics/>

                    <div className="mb-16 space-y-12">
                        {/* News Section */}
                        <div className="w-full max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="w-full min-w-0">
                                    <TWStories type="market" market="crypto" />
                                </div>
                                <div className="w-full min-w-0">
                                    <TWStories type="market" market="stock" />
                                </div>
                                <div className="w-full min-w-0">
                                    <TWStories type="market" market="index" />
                                </div>
                            </div>
                        </div>

                        {/* Market Screeners */}
                        <div className="w-full max-w-full mx-auto">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <div className="w-full bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all hover:bg-gray-800/70 shadow-lg">
                                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Market Overview</h3>
                                    <TWCryptoMarketScreener defaultColumn={"overview"}/>
                                </div>
                                <div className="w-full bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all hover:bg-gray-800/70 shadow-lg">
                                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Performance Analysis</h3>
                                    <TWCryptoMarketScreener defaultColumn={"performance"}/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
