// TWTickerTape.tsx
import React, { useEffect, useRef, memo } from "react";

interface SymbolItem {
    proName: string; // e.g. "BINANCE:BTCUSDT"
    title: string;   // e.g. "Bitcoin"
}

interface TWTickerTapeProps {
    symbols: SymbolItem[];
    colorTheme?: "dark" | "light";
    locale?: string;
}

const TWTickerTape: React.FC<TWTickerTapeProps> = ({
                                                       symbols,
                                                       colorTheme = "dark",
                                                       locale = "en",
                                                   }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // clear old widget if re-rendered
        container.current.innerHTML = "";

        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify(
            {
                symbols,
                colorTheme,
                locale,
                largeChartUrl: "",
                isTransparent: false,
                showSymbolLogo: true,
                displayMode: "regular",
            },
            null,
            2
        );

        container.current.appendChild(script);
    }, [symbols, colorTheme, locale]);

    return (
        <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export default memo(TWTickerTape);