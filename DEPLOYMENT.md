# Deployment Guide - SNIPERKING.SITE.$

## Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Deriv App ID: 1089 (already configured)

## Local Development Setup

```bash
# Clone repository
git clone https://github.com/ericksonlangat61-cell/sniperking.git
cd sniperking

# Install all dependencies
npm run install-all

# Setup environment variables
cp server/.env.example server/.env

# Edit server/.env with your configuration:
# DERIV_APP_ID=1089
# ADMIN_USER=manu
# ADMIN_PASS=your_secure_password
# MONGODB_URI=your_mongodb_connection
# JWT_SECRET=your_secret_key_min_32_chars
# PORT=5000
# NODE_ENV=development

# Start development servers
npm run dev
```

Client will be available at `http://localhost:3000`
Server will be available at `http://localhost:5000`

## Production Build

```bash
# Build frontend
npm run build-client

# Frontend files will be in client/dist
# Server will serve them automatically

# Start production server
NODE_ENV=production npm start
```

## Environment Variables

### Server (.env)
```bash
DERIV_APP_ID=1089
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_key_min_32_chars
MONGODB_URI=mongodb://user:pass@host:port/sniperking
ADMIN_USER=manu
ADMIN_PASS=your_secure_password_here
CLIENT_URL=https://sniperking.site.$
```

**CRITICAL:** Never hardcode `ADMIN_PASS` in code. Always use environment variables.

## Admin Setup

1. Set `ADMIN_USER` and `ADMIN_PASS` in environment variables
2. Password is never stored in code - use secure password manager
3. First login should be done securely (HTTPS only)
4. Admin can then create additional user accounts from admin panel

## Security Checklist

- [ ] Set strong JWT_SECRET (min 32 characters)
- [ ] Set strong ADMIN_PASS in environment
- [ ] Use HTTPS in production
- [ ] Configure CORS properly for your domain
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Set NODE_ENV=production
- [ ] Enable rate limiting on API
- [ ] Regular database backups
- [ ] Monitor WebSocket connections for abuse
- [ ] Keep dependencies updated
- [ ] Never commit .env files to git

## Scaling Considerations

- Use Redis for caching market data across instances
- Use load balancer (nginx) for multiple server instances
- Consider splitting WebSocket handling to separate service
- Use CDN for static assets
- Monitor latency metrics continuously (target: 0-80ms)

## Monitoring

Key metrics to monitor:
- WebSocket connection uptime
- Tick data latency (target: 0-80ms)
- API response times
- Database query performance
- Memory usage (market data cache)
- Error rates

## Troubleshooting

### WebSocket not connecting
- Check DERIV_APP_ID is correct (1089)
- Verify wss://ws.derivws.com is accessible
- Check firewall/proxy settings
- Review browser console for errors

### High latency (>80ms)
- Check network conditions
- Verify database indexing
- Reduce number of concurrent market subscriptions
- Consider using WebSocket fallback endpoint

### Admin login failing
- Verify ADMIN_USER and ADMIN_PASS in environment
- Check password hashing implementation
- Review authentication logs
- Clear browser cache/cookies

## Support

For issues: https://github.com/ericksonlangat61-cell/sniperking/issues

---

**SNIPERKING.SITE.$ - Advanced Deriv Market Intelligence**
