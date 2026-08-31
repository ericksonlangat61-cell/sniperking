# SNIPERKING.SITE.$

**Advanced Deriv Market Intelligence**

## Overview

SniperKing is a professional-grade real-time market analysis platform for Deriv synthetic indices. It provides AI-powered signal generation, multi-market scanning, and advanced technical analysis across 9 distinct strategies.

## Features

### 👑 9 Core Strategies
- **MATCHES** - Digit frequency analysis (10 sec countdown)
- **EVEN / ODD** - Parity pattern detection (15 sec countdown)
- **OVER / UNDER** - Barrier level analysis (15 sec countdown)
- **RISE / FALL** - Price direction prediction (15 sec countdown)
- **ONLY UPS** - Consecutive uptrend detection (15 sec countdown)
- **ONLY DOWNS** - Consecutive downtrend detection (15 sec countdown)

### 🚀 Advanced Capabilities
- **20 Market Auto-Scanner** - Dynamic Deriv market selection
- **0-80ms Live Latency** - Constant low-latency WebSocket
- **Multi-Timeframe Analysis** - 25-1500 tick windows
- **Technical Indicators** - RSI, MACD, Bollinger Bands, SMA/EMA, ATR
- **AI Mode Engine** - Real-time market ranking
- **Backtesting Lab** - Historical strategy testing
- **Custom Strategy Presets** - Save and apply winning formulas
- **Admin Control Center** - User management with role-based access

### 🔐 Security
- ✓ No hardcoded passwords
- ✓ No API tokens in frontend
- ✓ Password hashing with bcryptjs
- ✓ JWT session management
- ✓ Environment variable secrets

### 📱 Cross-Platform
- Desktop multi-panel terminal experience
- Mobile-optimized responsive design (Android focus)
- PWA installation capability
- Offline-first architecture

## Technology Stack

### Backend
- **Node.js + Express.js** - Server framework
- **WebSocket (ws)** - Real-time Deriv data
- **JWT** - Authentication
- **bcryptjs** - Password security

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Chart.js / Recharts** - Data visualization

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/ericksonlangat61-cell/sniperking.git
cd sniperking

# Install dependencies
npm run install-all

# Configure environment
cp server/.env.example server/.env
# Edit .env with your credentials

# Build frontend
npm run build

# Start server
npm start
```

## Configuration

See `SETUP.md` for detailed environment configuration.

## Deployment

See `DEPLOYMENT.md` for production deployment guide.

## License

MIT License

---

**SNIPERKING.SITE.$ - Advanced Deriv Market Intelligence**
