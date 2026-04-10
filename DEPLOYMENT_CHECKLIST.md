# ZEDU Deployment Checklist

## Pre-Deployment

- [ ] All code committed to Git
- [ ] Test locally with `flask run`
- [ ] Database migrations tested locally
- [ ] Frontend loads without errors
- [ ] API endpoints tested with Postman/curl
- [ ] Environment variables documented
- [ ] .gitignore properly configured
- [ ] No hardcoded secrets in code
- [ ] Requirements.txt updated with all dependencies

## Render Setup

- [ ] Render account created
- [ ] GitHub repository connected to Render
- [ ] render.yaml file created and committed
- [ ] Procfile created for backend
- [ ] Build scripts executable

## Backend Preparation

- [ ] Gunicorn added to requirements.txt ✅
- [ ] Flask-Migrate configured ✅
- [ ] Database models defined ✅
- [ ] API routes error handling implemented ✅
- [ ] CORS configured for production ✅
- [ ] JWT tokens configured ✅
- [ ] Logging configured ✅

## Frontend Preparation

- [ ] API client auto-detects environment ✅
- [ ] No hardcoded development URLs ✅
- [ ] CORS headers handled properly ✅
- [ ] Error handling for API failures ✅
- [ ] Responsive design tested ✅
- [ ] All Bootstrap CDN links valid ✅

## Database

- [ ] PostgreSQL database created on Render
- [ ] Database credentials noted
- [ ] Migrations script ready
- [ ] Initial data (if any) prepared
- [ ] Backup strategy planned

## Environment Variables

**Backend (Render Dashboard)**
```
FLASK_ENV = production
DATABASE_URL = postgresql://...
SECRET_KEY = [32+ random characters]
JWT_SECRET_KEY = [32+ random characters]
```

- [ ] All variables set on Render
- [ ] No variables leaked in logs
- [ ] Secrets regenerated for production

## Deployment Steps

1. [ ] Push code to GitHub
2. [ ] Use render.yaml for deployment OR
3. [ ] Create PostgreSQL service on Render
4. [ ] Create Web Service for backend
5. [ ] Create Static Site service for frontend
6. [ ] Set environment variables
7. [ ] Deploy services
8. [ ] Wait for build and deployment
9. [ ] Test endpoints
10. [ ] Verify database connection

## Post-Deployment Testing

- [ ] Frontend loads at production URL
- [ ] Backend API responds to health check
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Dashboard loads correctly
- [ ] Can browse courses
- [ ] Can browse tutors
- [ ] Database queries working
- [ ] Error handling working
- [ ] All pages load without 404

## Monitoring

- [ ] Access Render dashboard logs
- [ ] Check error logs regularly
- [ ] Monitor database size
- [ ] Monitor API response times
- [ ] Set up Render alerts

## Security

- [ ] HTTPS enabled (automatic on Render)
- [ ] CORS properly restricted ✅
- [ ] SQL injection prevented (SQLAlchemy) ✅
- [ ] XSS protection enabled ✅
- [ ] Session security configured ✅
- [ ] Passwords hashed (bcrypt) ✅
- [ ] API rate limiting considered
- [ ] Database backups enabled

## Performance

- [ ] Cold start time acceptable
- [ ] Database query optimization done
- [ ] CSS/JS minification (if needed)
- [ ] Images optimized
- [ ] Cache headers set

## Documentation

- [ ] Deployment documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide created
- [ ] Team trained on deployment
- [ ] Runbook created for incidents

## Maintenance Plan

- [ ] Regular backups scheduled
- [ ] Security updates planned
- [ ] Database maintenance scheduled
- [ ] Monitoring alerts configured
- [ ] On-call rotation established
- [ ] Upgrade plan for paid tiers

## Success Criteria

✅ All backend services running
✅ All frontend pages loading
✅ Database connected and accessible
✅ Users can register and login
✅ API endpoints responding correctly
✅ Logs being generated properly
✅ No critical errors in logs
✅ Response times acceptable
✅ HTTPS working
✅ Production data in place

## Rollback Plan

- [ ] Previous deployment accessible
- [ ] Rollback procedure documented
- [ ] Team knows how to rollback
- [ ] Rollback tested (if possible)

## Go Live

- [ ] All checks passed
- [ ] Stakeholders notified
- [ ] Monitoring active
- [ ] Team on standby
- [ ] Launch completed! 🚀
