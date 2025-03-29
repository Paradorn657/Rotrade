import { useEffect, useRef } from "react";

export function TradingViewUSDJPYMiniChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "FX:USDJPY", // เปลี่ยนเป็นสินทรัพย์ที่ต้องการ
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "12M",
      colorTheme: "dark", // เปลี่ยนเป็น "light" ถ้าต้องการพื้นหลังขาว
      isTransparent: false,
      autosize: true,
      largeChartUrl: ""
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export function TradingViewEURUSDMiniChart() {
    const containerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (!containerRef.current) return;
  
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: "FX:EURUSD", // เปลี่ยนเป็นสินทรัพย์ที่ต้องการ
        width: "100%",
        height: "100%",
        locale: "en",
        dateRange: "12M",
        colorTheme: "dark", // เปลี่ยนเป็น "light" ถ้าต้องการพื้นหลังขาว
        isTransparent: false,
        autosize: true,
        largeChartUrl: ""
      });
  
      containerRef.current.appendChild(script);
    }, []);
  
    return (
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    );
  }

  export function TradingViewGBPUSDMiniChart() {
    const containerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (!containerRef.current) return;
  
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: "FX:GBPUSD", // เปลี่ยนเป็นสินทรัพย์ที่ต้องการ
        width: "100%",
        height: "100%",
        locale: "en",
        dateRange: "12M",
        colorTheme: "dark", // เปลี่ยนเป็น "light" ถ้าต้องการพื้นหลังขาว
        isTransparent: false,
        autosize: true,
        largeChartUrl: ""
      });
  
      containerRef.current.appendChild(script);
    }, []);
  
    return (
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    );
  }

