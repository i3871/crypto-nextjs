// TWCryptoMarketScreener.tsx
import React, { useEffect, useRef, memo } from "react";

type TWCryptoMarketScreenerProps = {
    defaultColumn: "overview" | "performance" | string; // allow more if needed
    height?: number | string; // optional, default 550
};

const TWCryptoMarketScreener: React.FC<TWCryptoMarketScreenerProps> = ({
                                                                 defaultColumn,
                                                                 height = 550,
                                                             }) => {
    const container = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!container.current) return;

        // Clear previous widget if it exists
        container.current.innerHTML = "";

        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
      {
        "defaultColumn": "${defaultColumn}",    
        "screener_type": "crypto_mkt",
        "displayCurrency": "USD",
        "colorTheme": "dark",
        "isTransparent": false,
        "locale": "en",
        "width": "100%",
        "height": "${height}"
      }`;

        container.current.appendChild(script);
    }, [defaultColumn, height]);

    return (
        <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget" />
            <div className="tradingview-widget-copyright">
                <a
                    href="https://www.tradingview.com/crypto-coins-screener/"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                >
                    <span className="blue-text">Cryptocurrency market by TradingView</span>
                </a>
            </div>
        </div>
    );
};

export default memo(TWCryptoMarketScreener);