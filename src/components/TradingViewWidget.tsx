"use client";

import React, { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
    symbol: string;
    width?: number;
    height?: number;
}

function TradingViewWidget({ symbol, width = 980, height = 610 }: TradingViewWidgetProps) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // Clear any old script (important for hot reload in dev)
        container.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            allow_symbol_change: true,
            calendar: false,
            details: false,
            hide_side_toolbar: true,
            hide_top_toolbar: false,
            hide_legend: false,
            hide_volume: false,
            hotlist: false,
            interval: "W",
            locale: "en",
            save_image: true,
            style: "1",
            symbol: `${symbol}`,
            theme: "dark",
            timezone: "Etc/UTC",
            backgroundColor: "#0F0F0F",
            gridColor: "rgba(242, 242, 242, 0.06)",
            watchlist: [],
            withdateranges: false,
            compareSymbols: [],
            studies: ["STD;RSI"],
            width,
            height,
        });

        container.current.appendChild(script);
    }, [symbol, width, height]);

    return (
        <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright">
                <a
                    href={`https://www.tradingview.com/symbols/${symbol.replace(":", "-")}/`}
                    rel="noopener nofollow"
                    target="_blank"
                >
                    <span className="blue-text">{symbol} chart by TradingView</span>
                </a>
            </div>
        </div>
    );
}

export default memo(TradingViewWidget);