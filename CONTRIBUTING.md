# Contributing to SNIPERKING.SITE.$

## Code Style

- TypeScript for all new code
- ESLint + Prettier for formatting
- Descriptive variable and function names
- Comments for complex logic

## Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with clear messages: `git commit -m "Add new strategy analyzer"`
4. Push to branch and create Pull Request
5. Code review before merge

## Adding New Strategies

1. Add strategy definition to `src/utils/analysis.ts`
2. Create analysis function following existing pattern
3. Add to STRATEGIES array
4. Test with sample data
5. Update countdown timer in component

## Performance Guidelines

- Keep WebSocket latency < 80ms
- Throttle heavy calculations every 3rd tick
- Use Web Workers for indicator calculations
- Cache market data efficiently
- Optimize React component renders

## Testing

```bash
# Unit tests (add later)
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## Submitting Issues

Include:
- Clear description of bug/feature
- Steps to reproduce (if bug)
- Expected vs actual behavior
- Browser/environment details
- Screenshots if applicable

---

**SNIPERKING.SITE.$ - Advanced Deriv Market Intelligence**
