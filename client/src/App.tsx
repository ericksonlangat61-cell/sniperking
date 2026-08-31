import React, { useState, useMemo, useEffect } from 'react';
import { useDeriv, MARKET_LABELS } from './hooks/useDeriv';
import { calculateDigitStats, analyzeMatches, analyzeEvenOdd, analyzeRiseFall, analyzeOnlyUps, analyzeOnlyDowns } from './utils/analysis';

const STRATEGIES = [
  { id: 'MATCHES', label: 'MATCHES', color: '#FFC107' },
  { id: 'EVEN_ODD', label: 'EVEN / ODD', color: '#00FF88' },
  { id: 'OVER_UNDER', label: 'OVER / UNDER', color: '#00BFFF' },
  { id: 'RISE_FALL', label: 'RISE / FALL', color: '#FF00FF' },
  { id: 'ONLY_UPS', label: 'ONLY UPS', color: '#00FF88' },
  { id: 'ONLY_DOWNS', label: 'ONLY DOWNS', color: '#FF4444' }
];

const WINDOW_SIZES = [25, 50, 100, 200, 500, 1000, 1250, 1500];

export default function App() {
  const [selectedMarket, setSelectedMarket] = useState('R_100_1s');
  const [selectedStrategy, setSelectedStrategy] = useState('MATCHES');
  const [windowSize, setWindowSize] = useState(100);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSignal, setCurrentSignal] = useState<any>(null);
  const [countdownTime, setCountdownTime] = useState(10);
  
  const { status, markets, ticks, latency, uptime, reconnect } = useDeriv(selectedMarket);

  // Filter by market
  const marketTicks = useMemo(() => {
    return ticks;
  }, [ticks]);

  // Calculate analysis
  const analysis = useMemo(() => {
    if (marketTicks.length < windowSize) return null;

    let result = null;
    switch (selectedStrategy) {
      case 'MATCHES':
        result = analyzeMatches(marketTicks, windowSize);
        break;
      case 'EVEN_ODD':
        result = analyzeEvenOdd(marketTicks, windowSize);
        break;
      case 'OVER_UNDER':
        result = analyzeRiseFall(marketTicks, windowSize);
        break;
      case 'RISE_FALL':
        result = analyzeRiseFall(marketTicks, windowSize);
        break;
      case 'ONLY_UPS':
        result = analyzeOnlyUps(marketTicks, windowSize);
        break;
      case 'ONLY_DOWNS':
        result = analyzeOnlyDowns(marketTicks, windowSize);
        break;
    }
    return result;
  }, [marketTicks, selectedStrategy, windowSize]);

  // Countdown timer
  useEffect(() => {
    if (!isAnalyzing) return;
    
    const duration = selectedStrategy === 'MATCHES' ? 10 : 15;
    setCountdownTime(duration);
    
    const timer = setInterval(() => {
      setCountdownTime(prev => {
        if (prev <= 1) {
          // Generate new signal
          return duration;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isAnalyzing, selectedStrategy]);

  // Generate signal when analyzing
  useEffect(() => {
    if (isAnalyzing && analysis && analysis.score >= 60) {
      setCurrentSignal({
        market: MARKET_LABELS[selectedMarket]?.name || selectedMarket,
        strategy: selectedStrategy,
        score: analysis.score,
        prediction: analysis.bestDigit !== undefined ? analysis.bestDigit : null,
        timestamp: Date.now()
      });
    }
  }, [analysis, isAnalyzing, selectedMarket, selectedStrategy]);

  const digitStats = useMemo(() => {
    if (marketTicks.length < windowSize) return [];
    return calculateDigitStats(marketTicks, windowSize);
  }, [marketTicks, windowSize]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="min-h-screen bg-black" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(0,255,136,0.03) 0%, transparent 100%)' }}>
      {/* Header */}
      <header className="border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-yellow-500 flex items-center justify-center text-yellow-400 text-sm font-bold">👑</div>
          <div>
            <div className="text-yellow-400 font-bold text-lg" style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SNIPERKING.SITE.$</div>
            <div className="text-green-400 text-xs font-mono">AI Deriv Sniper</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            status === 'LIVE' ? 'bg-green-400' : status === 'CONNECTING' ? 'bg-yellow-400' : 'bg-red-500'
          }`}></div>
          <span className="text-gray-400 text-sm">{status}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Signal Hero Card */}
        {isAnalyzing && currentSignal && (
          <div className="mb-6 p-6 rounded-2xl border border-yellow-500" style={{ backgroundColor: '#0a0a0a', boxShadow: '0 0 30px rgba(255,193,7,0.2)' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-gray-500 text-sm mb-1">{MARKET_LABELS[selectedMarket]?.group}</div>
                <div className="text-white font-bold text-2xl mb-2">{currentSignal.market}</div>
                <div className="text-yellow-400 font-bold text-xl">TRADE: {currentSignal.strategy}</div>
                {currentSignal.prediction !== null && <div className="text-green-400 mt-2">PREDICTION DIGIT: {currentSignal.prediction}</div>}
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-white">{countdownTime}s</div>
                <div className="text-gray-500 text-sm">● LIVE</div>
              </div>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500" style={{ width: `${(countdownTime / (selectedStrategy === 'MATCHES' ? 10 : 15)) * 100}%`, transition: 'width 0.1s linear' }}></div>
            </div>
          </div>
        )}

        {/* Market Selector */}
        <div className="mb-6 p-6 rounded-2xl border border-gray-800" style={{ backgroundColor: '#0a0a0a', backdropFilter: 'blur(20px)' }}>
          <label className="text-gray-400 text-sm mb-2 block">SELECT MARKET (20 Available)</label>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:border-green-400 focus:outline-none"
          >
            {markets.map(m => (
              <option key={m.symbol} value={m.symbol}>{m.displayName}</option>
            ))}
          </select>
        </div>

        {/* Strategy Buttons */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {STRATEGIES.map(strat => (
            <button
              key={strat.id}
              onClick={() => setSelectedStrategy(strat.id)}
              className={`p-3 rounded-lg font-bold transition-all ${
                selectedStrategy === strat.id
                  ? 'border-2 text-white'
                  : 'border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
              style={{
                borderColor: selectedStrategy === strat.id ? strat.color : undefined,
                color: selectedStrategy === strat.id ? strat.color : undefined,
                backgroundColor: selectedStrategy === strat.id ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)',
                boxShadow: selectedStrategy === strat.id ? `0 0 15px ${strat.color}40` : 'none'
              }}
            >
              {strat.label}
            </button>
          ))}
        </div>

        {/* Analysis Controls */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setIsAnalyzing(!isAnalyzing)}
            className={`flex-1 p-4 rounded-lg font-bold transition-all ${
              isAnalyzing ? 'bg-green-900 border-2 border-green-400 text-green-400' : 'bg-gray-900 border border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            {isAnalyzing ? '⊙ ANALYSIS RUNNING' : '▶ START ANALYSIS'}
          </button>
          <button
            onClick={() => setIsAnalyzing(false)}
            className="flex-1 p-4 rounded-lg font-bold bg-red-900 border-2 border-red-500 text-red-400 transition-all hover:bg-red-800"
          >
            ⊗ STOP ANALYSIS
          </button>
        </div>

        {/* Window Size Selector */}
        <div className="mb-6 p-6 rounded-2xl border border-gray-800" style={{ backgroundColor: '#0a0a0a', backdropFilter: 'blur(20px)' }}>
          <label className="text-gray-400 text-sm mb-3 block">SELECT ANALYSIS TICKS</label>
          <div className="flex flex-wrap gap-2">
            {WINDOW_SIZES.map(size => (
              <button
                key={size}
                onClick={() => setWindowSize(size)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                  windowSize === size
                    ? 'bg-yellow-500 text-black font-bold'
                    : 'bg-gray-900 border border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Digit Heatmap */}
        <div className="mb-6 p-6 rounded-2xl border border-gray-800" style={{ backgroundColor: '#0a0a0a', backdropFilter: 'blur(20px)' }}>
          <h3 className="text-white font-bold mb-4">LAST DIGIT HEATMAP • {marketTicks.length} TICKS</h3>
          <div className="grid grid-cols-5 gap-3">
            {digitStats.slice(0, 10).map((stat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border-2 text-center transition-all"
                style={{
                  backgroundColor: '#0e0e0e',
                  borderColor: stat.isHot ? '#FFC107' : stat.isCold ? '#666' : '#333',
                  boxShadow: stat.isHot ? '0 0 10px rgba(255,193,7,0.3)' : 'none'
                }}
              >
                <div className="text-2xl font-bold text-white">{stat.digit}</div>
                <div className="text-xs text-gray-400">{stat.percentage.toFixed(1)}%</div>
                {stat.isHot && <div className="text-yellow-400 text-xs mt-1">HOT</div>}
                {stat.isCold && <div className="text-gray-500 text-xs mt-1">COLD</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Tick Stream */}
        <div className="mb-6 p-6 rounded-2xl border border-gray-800" style={{ backgroundColor: '#0a0a0a', backdropFilter: 'blur(20px)' }}>
          <h3 className="text-white font-bold mb-4">LIVE TICK STREAM</h3>
          <div className="space-y-1 font-mono text-sm max-h-96 overflow-y-auto">
            {marketTicks.slice(0, 50).map((tick, idx) => {
              const time = new Date(tick.epoch * 1000).toLocaleTimeString();
              const direction = idx < marketTicks.length - 1 && tick.quote > marketTicks[idx + 1].quote ? '↑' : '↓';
              return (
                <div key={idx} className="text-gray-400 hover:text-green-400 transition-colors">
                  <span className="text-gray-600">{time}</span>
                  <span className="mx-2 text-white">{tick.quote.toFixed(4)}</span>
                  <span className="text-yellow-400">DIGIT {tick.lastDigit}</span>
                  <span className={direction === '↑' ? 'text-green-400' : 'text-red-500'}>{direction}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-gray-800" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="text-gray-500 text-xs mb-1">STATUS</div>
            <div className={`text-lg font-bold ${
              status === 'LIVE' ? 'text-green-400' : status === 'CONNECTING' ? 'text-yellow-400' : 'text-red-500'
            }`}>{status}</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-800" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="text-gray-500 text-xs mb-1">LATENCY</div>
            <div className="text-lg font-bold text-green-400">{latency}ms</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-800" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="text-gray-500 text-xs mb-1">MARKETS</div>
            <div className="text-lg font-bold text-white">{markets.length}/20</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-800" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="text-gray-500 text-xs mb-1">UPTIME</div>
            <div className="text-lg font-bold text-white">{formatTime(uptime)}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 p-4 text-center text-gray-500 text-xs font-mono">
        © 2026 SNIPERKING.SITE.$ • Advanced Deriv Market Intelligence • 10-80ms LIVE
      </footer>
    </div>
  );
}
