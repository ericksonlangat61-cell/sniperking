import { useEffect, useRef, useState } from 'react';

export const ALLOWED_MARKETS = [
  'R_10_1s', 'R_15_1s', 'R_25_1s', 'R_30_1s', 'R_50_1s', 'R_75_1s', 'R_90_1s', 'R_100_1s',
  'R_10', 'R_25', 'R_50', 'R_75', 'R_100',
  'JD10', 'JD25', 'JD50', 'JD75', 'JD100',
  'RDBEAR', 'RDBULL'
];

export const MARKET_LABELS: Record<string, {name: string, group: string, subgroup: string}> = {
  'R_10_1s': {name: 'Volatility 10 (1s) Index', group: 'Continuous Indices', subgroup: 'Volatility (1s)'},
  'R_15_1s': {name: 'Volatility 15 (1s) Index', group: 'Continuous Indices', subgroup: 'Volatility (1s)'},
  'R_25_1s': {name: 'Volatility 25 (1s) Index', group: 'Continuous Indices', subgroup: 'Volatility (1s)'},
  'R_30_1s': {name: 'Volatility 30 (1s) Index', group: 'Continuous Indices', subgroup: 'Volatility (1s)'},
  'R_50_1s': {name: 'Volatility 50 (1s) Index', group: 'Continuous Indices', subgroup: 'Volatility (1s)'},
  'R_75_1s': {name: 'Volatility 75 (1s) Index', group: 'Continuous Indices', subgroup: 'Volatility (1s)'},
  'R_90_1s': {name: 'Volatility 90 (1s) Index', group: 'Continuous Indices', subgroup: 'Volatility (1s)'},
  'R_100_1s': {name: 'Volatility 100 (1s) Index', group: 'Continuous Indices', subgroup: 'Volatility (1s)'},
  'R_10': {name: 'Volatility 10 Index', group: 'Continuous Indices', subgroup: 'Volatility'},
  'R_25': {name: 'Volatility 25 Index', group: 'Continuous Indices', subgroup: 'Volatility'},
  'R_50': {name: 'Volatility 50 Index', group: 'Continuous Indices', subgroup: 'Volatility'},
  'R_75': {name: 'Volatility 75 Index', group: 'Continuous Indices', subgroup: 'Volatility'},
  'R_100': {name: 'Volatility 100 Index', group: 'Continuous Indices', subgroup: 'Volatility'},
  'JD10': {name: 'Jump 10 Index', group: 'Jump Indices', subgroup: ''},
  'JD25': {name: 'Jump 25 Index', group: 'Jump Indices', subgroup: ''},
  'JD50': {name: 'Jump 50 Index', group: 'Jump Indices', subgroup: ''},
  'JD75': {name: 'Jump 75 Index', group: 'Jump Indices', subgroup: ''},
  'JD100': {name: 'Jump 100 Index', group: 'Jump Indices', subgroup: ''},
  'RDBEAR': {name: 'Bear Market Index', group: 'Daily Reset Indices', subgroup: ''},
  'RDBULL': {name: 'Bull Market Index', group: 'Daily Reset Indices', subgroup: ''},
};

export function useDeriv(selectedSymbol: string) {
  const [status, setStatus] = useState<'CONNECTING'|'LIVE'|'OFFLINE'>('CONNECTING');
  const [markets, setMarkets] = useState<any[]>([]);
  const [ticks, setTicks] = useState<any[]>([]);
  const [latency, setLatency] = useState(0);
  const [uptime, setUptime] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout>();
  const uptimeIntervalRef = useRef<NodeJS.Timeout>();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(Date.now());
  const lastTickRef = useRef<number>(Date.now());

  const connectWS = () => {
    try {
      setStatus('CONNECTING');
      const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✓ Deriv WebSocket connected');
        setStatus('LIVE');
        
        // Request active symbols
        ws.send(JSON.stringify({ active_symbols: 'brief', product_type: 'basic' }));
        
        // Ping every 20s for connection health (Latency Target: 0-80ms)
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            const pingStart = Date.now();
            ws.send(JSON.stringify({ ping: 1 }));
            setTimeout(() => {
              const latencyVal = Math.max(1, Math.min(300, Date.now() - pingStart));
              setLatency(latencyVal);
            }, 50);
          }
        }, 20000);
      };

      ws.onmessage = (event) => {
        lastTickRef.current = Date.now();
        try {
          const data = JSON.parse(event.data);
          
          if (data.active_symbols) {
            const filtered = data.active_symbols
              .filter((s: any) => ALLOWED_MARKETS.includes(s.symbol))
              .map((s: any) => ({
                symbol: s.symbol,
                displayName: MARKET_LABELS[s.symbol]?.name || s.display_name,
                group: MARKET_LABELS[s.symbol]?.group || s.market_display_name,
                subgroup: MARKET_LABELS[s.symbol]?.subgroup || ''
              }));
            setMarkets(filtered);
          }
          
          if (data.tick) {
            const tick = data.tick;
            const lastDigit = Math.floor((tick.quote % 1) * 10000) % 10;
            setTicks(prev => [
              {
                epoch: tick.epoch,
                quote: tick.quote,
                lastDigit,
                id: tick.id
              },
              ...prev
            ].slice(0, 1500));
          }
        } catch (err) {
          console.error('Parse error:', err);
        }
      };

      ws.onerror = () => {
        console.error('WebSocket error');
        setStatus('OFFLINE');
      };

      ws.onclose = () => {
        console.log('WebSocket closed, reconnecting...');
        setStatus('OFFLINE');
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        reconnectTimeoutRef.current = setTimeout(connectWS, 2000);
      };
    } catch (err) {
      console.error('Connection error:', err);
      setStatus('OFFLINE');
    }
  };

  // Subscribe to ticks
  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && selectedSymbol) {
      wsRef.current.send(JSON.stringify({
        ticks_history: selectedSymbol,
        count: 500,
        subscribe: 1,
        style: 'ticks'
      }));
    }
  }, [selectedSymbol]);

  // Connect on mount
  useEffect(() => {
    connectWS();
    
    uptimeIntervalRef.current = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (uptimeIntervalRef.current) clearInterval(uptimeIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  return {
    status,
    markets,
    ticks,
    latency,
    uptime,
    reconnect: connectWS
  };
}
