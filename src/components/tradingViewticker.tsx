import { useEffect } from "react";

export default function TradingViewTicker() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FX:USDJPY", title: "USD/JPY" },
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "FX:GBPUSD", title: "GBP/USD" }
      ],
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en"
    });
    document.getElementById("tradingview-widget")?.appendChild(script);
  }, []);

  return <div id="tradingview-widget" />;
}
