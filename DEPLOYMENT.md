# Deployment Guide: PermohonanDoa.com

## Coolify Deployment

This guide covers deploying PermohonanDoa.com on [Coolify](https://coolify.io), an open-source, self-hosted PaaS.

### Prerequisites

- Coolify instance running (self-hosted or managed)
- PostgreSQL database (Coolify can manage this)
- Git repository (GitHub, GitLab, Gitea)
- OAuth credentials (Google, Facebook)

### Step 1: Prepare the Application

✅ **Already Done:**
- `Dockerfile` - Multi-stage build optimized for production
- `.dockerignore` - Excludes unnecessary files
- `next.config.ts` - Next.js configuration
- `package.json` - All dependencies defined

### Step 2: Set Up on Coolify

#### 2.1 Create New Application
1. Log in to Coolify dashboard
2. Click **New Project** or navigate to existing project
3. Click **New Service** → **Application**
4. Select **Git Repository**
5. Connect your Git provider (GitHub/GitLab/Gitea)
6. Select `permohonandoa-com` repository

#### 2.2 Configure Build Settings
1. **Build Pack**: Select **Docker**
2. **Docker File**: `Dockerfile` (default path)
3. **Build Command**: Leave empty (Dockerfile handles it)
4. **Start Command**: Leave empty (Dockerfile handles it)
5. **Port**: `3000`

#### 2.3 Set Environment Variables
Go to **Environment** tab and add:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
AUTH_SECRET=[generate with: openssl rand -base64 33]
AUTH_TRUST_HOST=true
GOOGLE_CLIENT_ID=[from Google Cloud Console]
GOOGLE_CLIENT_SECRET=[from Google Cloud Console]
FACEBOOK_CLIENT_ID=[from Facebook Developers]
FACEBOOK_CLIENT_SECRET=[from Facebook Developers]
NEXT_PUBLIC_FACEBOOK_APP_ID=[from Facebook Developers]
NODE_ENV=production
```

**Generating AUTH_SECRET:**
```bash
openssl rand -base64 33
```

#### 2.4 Configure Database
Option A: Use Coolify's PostgreSQL Service
1. In the same project, create a new **PostgreSQL** service
2. Set database name: `permohonandoa`
3. Coolify will generate connection string automatically
4. Copy the connection string to `DATABASE_URL` env var

Option B: Use External PostgreSQL
1. Point `DATABASE_URL` to your external PostgreSQL server
2. Ensure network access is configured
3. Test connection before deploying

#### 2.5 Configure Domain
1. Go to **Settings** → **Domain**
2. Add your domain (e.g., `prayers.yourdomain.com`)
3. Coolify auto-generates SSL certificate (Let's Encrypt)

### Step 3: Deploy

#### First Deployment
1. Click **Deploy** button
2. Coolify will:
   - Build Docker image
   - Run database migrations
   - Start the application
3. Monitor logs in **Deployment** tab

#### Database Migration
The app uses Drizzle ORM. Before first deployment:

Option 1: Run migrations via Coolify
```bash
npm run db:push
```

Option 2: Create script in `scripts` directory for Coolify to run

#### Subsequent Deployments
- Push to `main` branch
- Coolify auto-detects changes (if webhook configured)
- Or manually trigger **Redeploy** button

### Step 4: Verify Deployment

1. **Health Check**: Visit `https://yourdomain.com`
2. **Database Connection**: Create a prayer request
3. **Authentication**: Test login with OAuth
4. **Logs**: Check Coolify logs for errors

### Monitoring

#### Logs
- Real-time logs in Coolify dashboard
- Filter by application, error level

#### Metrics (if enabled)
- CPU usage
- Memory usage
- Network throughput
- Application response time

#### Database Backups
- Configure automated backups in PostgreSQL service
- Retention: Keep at least 7 days of backups

### Common Issues & Solutions

#### Issue: Database connection timeout
**Solution:**
- Verify `DATABASE_URL` format
- Check network access between app and database
- Ensure database service is running

#### Issue: OAuth not working
**Solution:**
- Verify OAuth credentials are correct
- Add domain to OAuth app's authorized origins
- Check `AUTH_SECRET` is set

#### Issue: Build fails
**Solution:**
- Check Dockerfile syntax
- Verify all dependencies in `package.json`
- Check build logs for specific errors

#### Issue: High memory usage
**Solution:**
- Set memory limits in Coolify
- Enable swap (if available)
- Optimize Node.js heap size

### Performance Tuning

#### 1. Enable caching
In `next.config.ts`:
```typescript
const config: NextConfig = {
  cacheHandler: require.resolve('./cache-handler.js'),
  // ...
};
```

#### 2. Database connection pooling
Use PgBouncer or connection pooling proxy:
```
DATABASE_URL=postgresql://user:pass@pgbouncer:6432/db?schema=public
```

#### 3. Redis caching (optional)
For session and cache layer:
```
REDIS_URL=redis://[host]:[port]
```

### Scaling

#### Vertical Scaling
- Increase CPU/memory in Coolify instance settings
- Restart application

#### Horizontal Scaling
1. Set replica count in Coolify: **Scaling** → **Replicas**: 2-3
2. Configure load balancer (Coolify handles this)
3. Sticky sessions enabled for auth

### Security Checklist

- [ ] `AUTH_SECRET` is strong (generated with openssl)
- [ ] `AUTH_TRUST_HOST=true` in production
- [ ] HTTPS enabled (Let's Encrypt)
- [ ] OAuth keys from authorized apps only
- [ ] Database backups configured
- [ ] Regular updates applied
- [ ] Firewall rules restrict access
- [ ] Hide sensitive errors in production

### Rollback Strategy

If deployment fails:
1. Go to **Deployment History**
2. Select previous stable version
3. Click **Redeploy to this version**
4. Verify application works
5. Check logs for what failed

### Manual Coolify Deployment (Docker CLI)

If using your own Coolify instance:

```bash
# Build image
docker build -t permohonandoa:latest .

# Push to registry (if using private registry)
docker tag permohonandoa:latest registry.yourdomain.com/permohonandoa:latest
docker push registry.yourdomain.com/permohonandoa:latest

# Deploy via docker-compose
docker-compose -f docker-compose.yml up -d
```

### Environment-specific Configs

#### Development
```
NODE_ENV=development
DEBUG=*
```

#### Staging
```
NODE_ENV=production
LOG_LEVEL=debug
```

#### Production
```
NODE_ENV=production
LOG_LEVEL=error
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Maintenance

#### Weekly
- Monitor error logs
- Check database size growth
- Review OAuth error rates

#### Monthly
- Update Node.js dependencies
- Backup and test backup restoration
- Review performance metrics
- Update SSL certificates if needed

#### Quarterly
- Update system packages
- Review security patches
- Performance optimization review

---

## Alternative Deployment Options

### Vercel
Optimized for Next.js, but less control:
```bash
npm i -g vercel
vercel
```

### Railway
Railway + PostgreSQL in minutes:
```bash
railway link
railway up
```

### DigitalOcean App Platform
```bash
# Connect DigitalOcean repo
# Add app.yaml configuration
```

### Self-hosted Docker
Use the provided `Dockerfile` and `docker-compose.yml` on any server with Docker.

---

**Need Help?**
- [Coolify Documentation](https://coolify.io/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment/other-platforms)
- Project Issues: Create GitHub issue
