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
cp client/.env.example client/.env

# Edit server/.env with your configuration:
# MONGODB_URI=your_mongodb_connection
# JWT_SECRET=your_secret_key
# ADMIN_USERNAME=manu (default)

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

## Docker Deployment (Optional)

Create `Dockerfile` at root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY server/ ./server/
COPY client/dist/ ./client/dist/

RUN cd server && npm install --production

EXPOSE 5000

CMD ["npm", "start"]
```

## Environment Variables

### Server (.env)
```bash
DERIV_APP_ID=1089
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_key_change_this
MONGODB_URI=mongodb://user:pass@host:port/sniperking
ADMIN_USERNAME=manu
CLIENT_URL=https://sniperking.site.$
```

### Client (if using .env)
```bash
VITE_API_URL=https://api.sniperking.site.$
```

## Admin Setup

1. On first deployment, the admin account `manu` should be created via environment setup
2. Password is never stored in code - use secure password manager
3. First login should be done securely (HTTPS only)
4. Admin can then create additional user accounts from admin panel

## Security Checklist

- [ ] Set strong JWT_SECRET (min 32 characters)
- [ ] Use HTTPS in production
- [ ] Configure CORS properly for your domain
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Set NODE_ENV=production
- [ ] Enable rate limiting on API
- [ ] Regular database backups
- [ ] Monitor WebSocket connections for abuse
- [ ] Keep dependencies updated

## Scaling Considerations

- Use Redis for caching market data across instances
- Use load balancer (nginx) for multiple server instances
- Consider splitting WebSocket handling to separate service
- Use CDN for static assets
- Monitor latency metrics continuously

## Monitoring

Key metrics to monitor:
- WebSocket connection uptime
- Tick data latency (target: 10-80ms)
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

### High latency
- Check network conditions
- Verify database indexing
- Reduce number of concurrent market subscriptions
- Consider using WebSocket fallback endpoint

### Admin login failing
- Verify ADMIN_USERNAME in environment
- Check password hashing implementation
- Review authentication logs
- Clear browser cache/cookies

## Support

For issues: https://github.com/ericksonlangat61-cell/sniperking/issues

---

**SNIPERKING.SITE.$ - Advanced Deriv Market Intelligence**
