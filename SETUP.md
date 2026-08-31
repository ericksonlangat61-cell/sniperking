# SNIPERKING.SITE.$ - WebSocket Real-Time Configuration

## Environment Variables

```bash
# Deriv
DERIV_APP_ID=1089

# Admin (NO HARDCODED PASSWORDS)
ADMIN_USERNAME=manu
# Password set via environment only

# Server
PORT=5000
NODE_ENV=production
JWT_SECRET=your_secret_key

# Database
MONGODB_URI=mongodb://localhost:27017/sniperking
```

## WebSocket Connection

- **Endpoint:** `wss://ws.derivws.com/websockets/v3?app_id=1089`
- **No Token Required:** Direct connection using App ID only
- **Ping Interval:** Every 1 second for latency measurement
- **Markets Subscribed:** 20 synthetic indices (R_10_1s through RDBULL)
- **Tick History:** Last 1500 ticks per market
- **Latency Target:** 10-80ms

## Market List (20 Total)

### Continuous Indices - Volatility (1s) - 8 markets
- R_10_1s, R_15_1s, R_25_1s, R_30_1s, R_50_1s, R_75_1s, R_90_1s, R_100_1s

### Continuous Indices - Volatility - 5 markets
- R_10, R_25, R_50, R_75, R_100

### Jump Indices - 5 markets
- JD10, JD25, JD50, JD75, JD100

### Daily Reset Indices - 2 markets
- RDBEAR, RDBULL

## Admin Authentication

**Username:** `manu`
**Password:** Managed via environment variables only - NEVER hardcoded

No tokens used in this system - WebSocket App ID 1089 provides access.

## 9 Strategies

1. MATCHES (10 sec countdown) - Best digit frequency analysis
2. EVEN (15 sec countdown) - Even/Odd parity patterns
3. ODD (15 sec countdown) - Odd pattern detection
4. OVER (15 sec countdown) - Barrier level analysis
5. UNDER (15 sec countdown) - Under barrier patterns
6. RISE (15 sec countdown) - Price uptrend prediction
7. FALL (15 sec countdown) - Price downtrend prediction
8. ONLY UPS (15 sec countdown) - Consecutive uptrend detection
9. ONLY DOWNS (15 sec countdown) - Consecutive downtrend detection

## Build & Run

```bash
# Install all
npm run install-all

# Development
npm run dev

# Production build
npm run build

# Start server
npm start
```

## Brand

- **Domain:** SNIPERKING.SITE.$
- **Logo:** Gold crown emoji with neon green accent
- **Color Scheme:** Black #000, Neon Green #00FF88, Gold #FFC107, Neon Blue #00BFFF
- **Style:** Dark trading terminal with glassmorphism (20px blur)
- **Typography:** Inter + JetBrains Mono

## Security Notes

✓ No hardcoded passwords
✓ No API tokens in frontend
✓ WebSocket uses App ID only (1089)
✓ Admin credentials via environment
✓ Password hashing with bcryptjs
✓ JWT for session management
✓ Rate limiting on API endpoints

---

**SNIPERKING.SITE.$ - Advanced Deriv Market Intelligence**
