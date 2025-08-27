// TradingViewWidget.tsx
import React, {useEffect, useRef, memo} from "react";

type TWStoriesSymbolProps = {
    type: "symbol";
    symbol: string; // e.g. "BITSTAMP:BTCUSD", "NASDAQ:AAPL"
    width?: number | string;
    height?: number | string;
};

type TWStoriesMarketProps = {
    type: "market";
    market: "crypto" | "stock" | "forex" | "index" | "futures" | "cfd"; // Extended to support stock market
    width?: number | string;
    height?: number | string;
};

type TWStoriesProps = TWStoriesSymbolProps | TWStoriesMarketProps;

const TWStories: React.FC<TWStoriesProps> = (props) => {
    const {width = 400, height = 550} = props;
    const container = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!container.current) return;

        // Clean up any existing widget to avoid duplicates
        container.current.innerHTML = "";

        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
        script.type = "text/javascript";
        script.async = true;

        // Create config based on type
        let config;
        if (props.type === "symbol") {
            config = {
                displayMode: "compact",
                feedMode: "symbol",
                symbol: props.symbol,
                colorTheme: "dark",
                isTransparent: false,
                locale: "en",
                width: width.toString(),
                height: height.toString()
            };
        } else {
            config = {
                displayMode: "compact",
                feedMode: "market",
                market: props.market,
                colorTheme: "dark",
                isTransparent: false,
                locale: "en",
                width: width.toString(),
                height: height.toString()
            };
        }

        script.innerHTML = JSON.stringify(config);
        container.current.appendChild(script);
    }, [props, width, height]);

    return (
        <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright">
                <a
                    href="https://www.tradingview.com/news-flow/?priority=top_stories"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                >
                    <span className="blue-text">Top stories by TradingView</span>
                </a>
            </div>
        </div>
    );
};

export default memo(TWStories);