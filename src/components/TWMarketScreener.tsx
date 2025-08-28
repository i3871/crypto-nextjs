// TWMarketScreener.tsx
import React, { useEffect, useRef, memo } from 'react';

interface TWMarketScreenerProps {
    market?: "crypto" | "forex" | "america" | "index";
    showToolbar?: boolean;
    defaultColumn?: "overview" | "performance";
    defaultScreen?: "general";
    isTransparent?: boolean;
    locale?: string;
    colorTheme?: "dark" | "light";
    width?: string | number;
    height?: string | number;
}

const TWMarketScreener: React.FC<TWMarketScreenerProps> = ({
    market = "crypto",
    showToolbar = true,
    defaultColumn = "overview",
    defaultScreen = "general",
    isTransparent = false,
    locale = "en",
    colorTheme = "dark",
    width = "100%",
    height = 550
}) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // Clear old widget if re-rendered
        container.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            market,
            showToolbar,
            defaultColumn,
            defaultScreen,
            isTransparent,
            locale,
            colorTheme,
            width,
            height
        });

        container.current.appendChild(script);
    }, [market, showToolbar, defaultColumn, defaultScreen, isTransparent, locale, colorTheme, width, height]);

    return (
        <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright">
                <a href="https://www.tradingview.com/screener/" rel="noopener nofollow" target="_blank">
                    <span className="blue-text">Screener by TradingView</span>
                </a>
            </div>
        </div>
    );
};

export default memo(TWMarketScreener);