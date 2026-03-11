# Rollback Procedures

## Vercel (Frontend)

### Via Dashboard
1. Go to [Vercel Dashboard](https://vercel.com) → Project → **Deployments**
2. Find the last known-good deployment
3. Click the **⋮** menu → **Promote to Production**
4. The rollback is instant — no rebuild required

### Via CLI
```bash
vercel rollback          # rolls back to the previous production deployment
vercel promote <url>     # promotes a specific deployment URL to production
```

### Notes
- Vercel keeps all deployment artifacts; rollback is a pointer change
- Environment variables are NOT rolled back — check if env changes caused the issue
- ISR-cached pages may serve stale content until revalidated

## Railway (Backend)

### Via Dashboard
1. Go to [Railway Dashboard](https://railway.com) → Service → **Deployments**
2. Click on the last healthy deployment
3. Use **Redeploy** to relaunch that version

### Via Git
```bash
# Identify the bad commit
git log --oneline -5

# Revert the bad commit(s)
git revert <commit-hash>
git push origin main
```
Railway auto-deploys on push to `main`, so the revert triggers a new deployment.

### Database Migrations
If the bad deployment included a migration:
1. **Do NOT** roll back migrations in production without a plan
2. Check if the migration is backward-compatible (additive only)
3. If destructive (column drop, rename), restore from the latest backup first
4. Contact the team before running `python manage.py migrate <app> <previous_migration>`

## Health Checks
- **Backend**: Railway health check endpoint configured in `railway.json`
- **Frontend**: Vercel automatically monitors deployment health
- After rollback, verify:
  - Frontend loads correctly: `curl -I https://dubaitennistickets.com`
  - API responds: `curl https://platform-backend-production-f268.up.railway.app/api/events/`
  - Stripe checkout flow works end-to-end

## Incident Response Checklist
1. Identify the issue (error logs, user reports, monitoring alerts)
2. Determine if it's frontend, backend, or both
3. Roll back the affected service using steps above
4. Verify the rollback resolved the issue
5. Investigate root cause on a separate branch
6. Deploy the fix through normal CI/CD pipeline
