export const STRATEGIES = [
  { id: 'MATCHES', name: 'MATCHES', color: '#FFC107', group: 'matches', duration: 10 },
  { id: 'EVEN', name: 'EVEN', color: '#00FF88', group: 'even_odd', duration: 15 },
  { id: 'ODD', name: 'ODD', color: '#00FF88', group: 'even_odd', duration: 15 },
  { id: 'OVER', name: 'OVER', color: '#00BFFF', group: 'over_under', duration: 15 },
  { id: 'UNDER', name: 'UNDER', color: '#00BFFF', group: 'over_under', duration: 15 },
  { id: 'RISE', name: 'RISE', color: '#00FF88', group: 'rise_fall', duration: 15 },
  { id: 'FALL', name: 'FALL', color: '#FF4444', group: 'rise_fall', duration: 15 },
  { id: 'ONLY_UPS', name: 'ONLY UPS', color: '#00FF88', group: 'only_ups', duration: 15 },
  { id: 'ONLY_DOWNS', name: 'ONLY DOWNS', color: '#FF4444', group: 'only_downs', duration: 15 }
];

export interface AnalysisSignal {
  market: string;
  strategy: string;
  score: number;
  prediction?: string | number;
  reason: string[];
  timestamp: number;
  confidence: number;
}

export interface DigitStats {
  digit: number;
  count: number;
  percentage: number;
  isHot: boolean;
  isCold: boolean;
}

export function calculateDigitStats(ticks: any[], windowSize: number = 100): DigitStats[] {
  const window = ticks.slice(0, windowSize);
  const digitCounts = new Array(10).fill(0);
  
  window.forEach((tick) => {
    const digit = tick.lastDigit !== undefined ? tick.lastDigit : Math.floor((tick.quote % 1) * 10000) % 10;
    digitCounts[digit]++;
  });

  const stats: DigitStats[] = [];
  const threshold = (window.length / 10) * 1.5;
  const coldThreshold = (window.length / 10) * 0.5;

  for (let i = 0; i < 10; i++) {
    stats.push({
      digit: i,
      count: digitCounts[i],
      percentage: window.length > 0 ? (digitCounts[i] / window.length) * 100 : 0,
      isHot: digitCounts[i] > threshold,
      isCold: digitCounts[i] < coldThreshold
    });
  }

  return stats.sort((a, b) => b.percentage - a.percentage);
}

export function analyzeMatches(ticks: any[], windowSize: number = 100): { bestDigit: number; score: number; confidence: number } {
  const digitStats = calculateDigitStats(ticks, windowSize);
  const bestDigit = digitStats[0];
  
  const baseScore = Math.min(100, bestDigit.percentage * 1.2);
  const confidence = Math.min(100, bestDigit.count);
  
  return {
    bestDigit: bestDigit.digit,
    score: Math.floor(baseScore),
    confidence: Math.floor(confidence)
  };
}

export function analyzeEvenOdd(ticks: any[], windowSize: number = 100): { even: number; odd: number; score: number; bestSide: string } {
  const window = ticks.slice(0, windowSize);
  let even = 0, odd = 0;
  
  window.forEach((tick) => {
    const digit = tick.lastDigit !== undefined ? tick.lastDigit : Math.floor((tick.quote % 1) * 10000) % 10;
    if (digit % 2 === 0) even++;
    else odd++;
  });

  const evenPct = window.length > 0 ? (even / window.length) * 100 : 0;
  const oddPct = 100 - evenPct;
  
  const dominantPct = Math.max(evenPct, oddPct);
  const score = Math.min(100, dominantPct * 1.1);
  const bestSide = evenPct > oddPct ? 'EVEN' : 'ODD';
  
  return { even: Math.floor(evenPct), odd: Math.floor(oddPct), score: Math.floor(score), bestSide };
}

export function analyzeOverUnder(ticks: any[], windowSize: number = 100, barrier: number = 5): { over: number; under: number; score: number; bestSide: string } {
  const window = ticks.slice(0, windowSize);
  let over = 0, under = 0;
  
  window.forEach((tick) => {
    const digit = tick.lastDigit !== undefined ? tick.lastDigit : Math.floor((tick.quote % 1) * 10000) % 10;
    if (digit >= barrier) over++;
    else under++;
  });

  const overPct = window.length > 0 ? (over / window.length) * 100 : 0;
  const underPct = 100 - overPct;
  
  const dominantPct = Math.max(overPct, underPct);
  const score = Math.min(100, dominantPct * 1.1);
  const bestSide = overPct > underPct ? 'OVER' : 'UNDER';
  
  return { over: Math.floor(overPct), under: Math.floor(underPct), score: Math.floor(score), bestSide };
}

export function analyzeRiseFall(ticks: any[], windowSize: number = 100): { rise: number; fall: number; score: number; bestSide: string } {
  const window = ticks.slice(0, windowSize);
  if (window.length < 2) return { rise: 0, fall: 0, score: 0, bestSide: 'NEUTRAL' };
  
  let upCount = 0, downCount = 0;
  
  for (let i = 0; i < window.length - 1; i++) {
    const current = window[i].quote;
    const next = window[i + 1].quote;
    if (current > next) upCount++;
    else if (current < next) downCount++;
  }

  const risePct = window.length > 0 ? (upCount / (window.length - 1)) * 100 : 0;
  const fallPct = 100 - risePct;
  
  const dominantPct = Math.max(risePct, fallPct);
  const score = Math.min(100, dominantPct * 1.1);
  const bestSide = risePct > fallPct ? 'RISE' : 'FALL';
  
  return { rise: Math.floor(risePct), fall: Math.floor(fallPct), score: Math.floor(score), bestSide };
}

export function analyzeOnlyUps(ticks: any[], windowSize: number = 100): { upStreak: number; score: number; upCount: number } {
  const window = ticks.slice(0, windowSize);
  if (window.length < 2) return { upStreak: 0, score: 0, upCount: 0 };
  
  let currentStreak = 0;
  let maxStreak = 0;
  let upCount = 0;
  
  for (let i = 0; i < window.length - 1; i++) {
    if (window[i].quote > window[i + 1].quote) {
      currentStreak++;
      upCount++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  const upPct = (upCount / (window.length - 1)) * 100;
  const streakBonus = Math.min(30, maxStreak * 5);
  const score = Math.min(100, (upPct * 0.7) + streakBonus);
  
  return { upStreak: maxStreak, score: Math.floor(score), upCount };
}

export function analyzeOnlyDowns(ticks: any[], windowSize: number = 100): { downStreak: number; score: number; downCount: number } {
  const window = ticks.slice(0, windowSize);
  if (window.length < 2) return { downStreak: 0, score: 0, downCount: 0 };
  
  let currentStreak = 0;
  let maxStreak = 0;
  let downCount = 0;
  
  for (let i = 0; i < window.length - 1; i++) {
    if (window[i].quote < window[i + 1].quote) {
      currentStreak++;
      downCount++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  const downPct = (downCount / (window.length - 1)) * 100;
  const streakBonus = Math.min(30, maxStreak * 5);
  const score = Math.min(100, (downPct * 0.7) + streakBonus);
  
  return { downStreak: maxStreak, score: Math.floor(score), downCount };
}

export function calculateRSI(ticks: any[], period: number = 14): number {
  if (ticks.length < period) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 0; i < period; i++) {
    const change = ticks[i].quote - ticks[i + 1].quote;
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return Math.round(rsi);
}

export function calculateSMA(ticks: any[], period: number = 20): number {
  if (ticks.length < period) return 0;
  
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += ticks[i].quote;
  }
  
  return sum / period;
}

export function calculateEMA(ticks: any[], period: number = 20): number {
  if (ticks.length < period) return 0;
  
  const k = 2 / (period + 1);
  let ema = 0;
  
  // Calculate initial SMA
  for (let i = period - 1; i >= 0; i--) {
    ema += ticks[i].quote;
  }
  ema /= period;
  
  // Calculate EMA for remaining ticks
  for (let i = period - 2; i >= 0; i--) {
    ema = ticks[i].quote * k + ema * (1 - k);
  }
  
  return ema;
}

export function calculateATR(ticks: any[], period: number = 14): number {
  if (ticks.length < period) return 0;
  
  let trSum = 0;
  for (let i = 0; i < period; i++) {
    const current = ticks[i].quote;
    const prev = ticks[i + 1]?.quote || current;
    const tr = Math.max(
      current - prev,
      Math.abs(current - prev)
    );
    trSum += tr;
  }
  
  return trSum / period;
}
