# ZEDU Render Deployment Guide

Complete guide to deploy ZEDU on Render.com

## Prerequisites

- Render.com account (free tier available)
- GitHub account with repository pushed
- PostgreSQL database (Render can provide)

## Step 1: Push Code to GitHub

```bash
cd ZEDU
git init
git add .
git commit -m "Initial ZEDU commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ZEDU.git
git push -u origin main
```

## Step 2: Deploy Backend on Render

### Option A: Using render.yaml (Recommended)

1. Go to https://render.com/dashboard
2. Click **New +** → **Blueprint**
3. Connect your GitHub repository
4. Name: `zedu-deployment`
5. Branch: `main`
6. Click **Deploy**

Render will automatically deploy:
- Backend service
- Frontend service
- PostgreSQL database

### Option B: Manual Deployment

#### 2.1 Create PostgreSQL Database

1. Dashboard → **New +** → **PostgreSQL**
2. Name: `zedu-db`
3. Database: `zedu`
4. User: `zedu_user`
5. Region: Oregon (or closest to you)
6. Plan: **Free**
7. Click **Create Database**
8. Note the **Internal Database URL** (looks like: `postgresql://...`)

#### 2.2 Deploy Backend Service

1. Dashboard → **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `zedu-backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt && flask db upgrade`
   - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
   - **Region**: Oregon
   - **Plan**: Free
4. Click **Advanced** and add Environment Variables:

```
FLASK_ENV = production
PYTHON_VERSION = 3.11
DATABASE_URL = postgresql://zedu_user:PASSWORD@dpg-xxxx.onrender.com/zedu
SECRET_KEY = (generate random string, at least 32 chars)
JWT_SECRET_KEY = (generate random string, at least 32 chars)
```

5. Click **Create Web Service**
6. Wait for deployment (2-5 minutes)

#### 2.3 Deploy Frontend Service

1. Dashboard → **New +** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `zedu-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: (leave empty)
   - **Publish Directory**: `.`
   - **Region**: Oregon
   - **Plan**: Free
4. Click **Create Static Site**

## Step 3: Configure Environment Variables

### Backend Environment Variables

In Render dashboard, go to **zedu-backend** service:

1. Settings → **Environment Variables**
2. Add/Update:

```
FLASK_ENV=production
DATABASE_URL=postgresql://zedu_user:your_password@your_host/zedu
SECRET_KEY=your_random_secret_key_32_chars_min
JWT_SECRET_KEY=your_random_jwt_key_32_chars_min
```

### Get Database Connection String

From PostgreSQL service page on Render:
- Copy the **Internal Database URL**
- Looks like: `postgresql://zedu_user:xxxxxxx@dpg-xxxxx.onrender.com/zedu`

## Step 4: Update Frontend for Production

The frontend is already configured to detect production URLs, but verify:

**js/api-client.js** should auto-detect:
- Development: `http://localhost:5000/api`
- Production: `https://zedu-backend.onrender.com/api`

Update the hardcoded URLs in the configuration if needed.

## Step 5: Verify Deployment

### Check Backend

```bash
curl https://zedu-backend.onrender.com/api/health
```

Should return:
```json
{"status": "ok", "message": "API is running"}
```

### Check Frontend

Visit: `https://zedu-frontend.onrender.com`

Should display the ZEDU home page.

### Test Registration

1. Go to frontend URL
2. Click **Sign Up**
3. Create account
4. Try to login
5. Should redirect to dashboard

## Step 6: Custom Domain (Optional)

1. Go to **zedu-frontend** service
2. Settings → **Custom Domain**
3. Enter your domain: `zedu.com`
4. Follow DNS configuration instructions

## Troubleshooting

### Backend Fails to Deploy

**Error: "ModuleNotFoundError"**
- Check `requirements.txt` has all dependencies
- Verify Python version in Render settings

**Error: "Database connection failed"**
- Verify DATABASE_URL is correct
- Check database is created
- Test connection string locally

**Error: "500 Internal Server Error"**
- Check backend logs in Render dashboard
- Verify environment variables are set
- Check database migrations ran

### Frontend Not Loading

**Blank page or 404**
- Check root directory is set to `frontend`
- Verify all files uploaded correctly
- Clear browser cache

**API calls failing**
- Check backend service is running
- Verify API_BASE_URL in js/api-client.js
- Check CORS settings

**"Cannot POST /api/auth/login"**
- Backend service may not be deployed
- Check backend logs for errors
- Restart backend service

## Monitoring

### View Logs

1. Go to service dashboard
2. Click **Logs** tab
3. View real-time logs

### Set Up Alerts

1. Settings → **Alerts**
2. Enable critical error notifications
3. Get notified of failures

## Performance Tips

### For Free Tier

- Spins down after 15 minutes of inactivity
- First request will be slow (cold start)
- Upgrade to Standard plan for production traffic

### Optimization

- Use CDN for static files
- Enable caching headers
- Optimize database queries
- Monitor database connections

## Database Backup

### Backup Database

From Render dashboard:

1. PostgreSQL service → **Backups**
2. Create manual backup
3. Backups auto-delete after 7 days on free tier

### Restore from Backup

Contact Render support or:

```bash
# Download and restore locally
pg_dump -h remote_host -U user -d dbname > backup.sql
# Then restore to production
psql -h remote_host -U user -d dbname < backup.sql
```

## Upgrade Plan

When ready for production with more traffic:

1. Upgrade Database: Free → Standard
2. Upgrade Backend Service: Free → Standard  
3. Upgrade Frontend Service: Free → Standard

## Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| Backend (Web) | Spins down after 15min | $7+/month Standard |
| Frontend (Static) | Always running | Free |
| Database | 256 MB | Free for small DBs, $15+/month Standard |
| **Total** | **Free but limited** | **~$22+/month** |

## Next Steps After Deployment

1. Set up email notifications
2. Configure domain name
3. Set up SSL certificate (automatic on Render)
4. Monitor logs and performance
5. Plan database maintenance
6. Test all features
7. Set up uptime monitoring

## Support

- Render Docs: https://render.com/docs
- ZEDU Issues: Check repository
- Community: Render Discord

## Rollback

To rollback to previous version:

1. Go to Deployment
2. Select previous deployment
3. Click **Redeploy**

## Additional Security

For production:

- [ ] Change all SECRET_KEY values
- [ ] Use strong database password
- [ ] Enable 2FA on Render account
- [ ] Set up API rate limiting
- [ ] Configure firewall rules
- [ ] Regular security audits
- [ ] Keep dependencies updated
