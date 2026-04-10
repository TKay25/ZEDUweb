# ZEDU - Quick Render Deployment Reference

## 30-Second Deployment Summary

```bash
# Step 1: Push to GitHub
git add .
git commit -m "Init"
git push

# Step 2: On Render Dashboard
# → New → Blueprint → Select Repository → Deploy

# Done! 🚀
```

## Key Files

| File | Purpose |
|------|---------|
| `render.yaml` | Complete infrastructure definition |
| `Procfile` | Gunicorn startup configuration |
| `requirements.txt` | Python dependencies + Gunicorn |
| `frontend/js/api-client.js` | Auto-detects production URLs |
| `backend/config.py` | Production settings |
| `backend/app.py` | Flask app with CORS |

## URLs When Deployed

| Service | URL |
|---------|-----|
| Frontend | https://zedu-frontend.onrender.com |
| Backend | https://zedu-backend.onrender.com |
| API | https://zedu-backend.onrender.com/api |
| Health Check | https://zedu-backend.onrender.com/api/health |

## Environment Variables to Set on Render

```
FLASK_ENV=production
SECRET_KEY=change_me_to_random_32_chars_min
JWT_SECRET_KEY=change_me_to_random_32_chars_min
DATABASE_URL=postgresql://... (auto-set by Render)
```

## Test After Deployment

```bash
# Check backend
curl https://zedu-backend.onrender.com/api/health

# Visit frontend
https://zedu-frontend.onrender.com

# Try to register and login
```

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Wait 2-3 min, backend still building |
| Database connection error | Check DATABASE_URL env var is set |
| CORS errors | Frontend calling wrong backend URL |
| Page loads but blank | Check browser console for API errors |
| 500 errors | View Render logs for backend errors |

## Accessing Files

**Backend:** `backend/` directory
- Main app: `app.py`
- Config: `config.py`  
- Routes: `routes/*.py`
- Models: `models.py`

**Frontend:** `frontend/` directory
- HTML: `*.html`
- JS: `js/*.js`
- CSS: `css/styles.css`

## GitHub Deployment URL

After pushing code, Render auto-deploys from:
```
https://github.com/YOUR_USERNAME/ZEDU
```

## Generated URLs (After Deployment)

Render assigns unique URLs like:
- `zedu-backend-xxxx.onrender.com`
- `zedu-frontend-xxxx.onrender.com`

(Note: URLs shown may vary, check Render dashboard)

## Production Checklist ✅

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] render.yaml file in project
- [ ] Git repository connected to Render
- [ ] Click "Deploy" on Render dashboard
- [ ] Wait for all 3 services to build
- [ ] Note the generated URLs
- [ ] Test registration & login
- [ ] Verify API health check
- [ ] Check error logs if issues

## Monitor Production

**Render Dashboard:**
- View live logs
- Check service status
- Monitor resource usage
- View historical data

**Quick Commands:**

```bash
# View production logs
# (Use Render Dashboard)

# If you need to rollback
# Render Dashboard → Select previous deployment → Redeploy
```

## CLI Deployment (Alternative)

If using Render CLI:

```bash
# Install Render CLI
npm install -g @render-oss/render-cli

# Login to Render
render login

# Deploy using blueprint
render deploy --blueprint
```

## Scale Up (When Needed)

1. Dashboard → Service → Settings
2. Change Plan from Free to Standard
3. Restart service
4. Get dedicated resources

## Typical Timeline

| Task | Time |
|------|------|
| Push code to GitHub | 1 min |
| Create Render services | 2 min |
| Set environment variables | 1 min |
| Build backend | 3-5 min |
| Build frontend | 1-2 min |
| Deploy database | 2-3 min |
| Total | **~10-15 min** |

## Success Indicators

✅ All 3 services show "Live" on Render dashboard
✅ No red error indicators
✅ Frontend page loads
✅ API health check returns 200
✅ Can register new user
✅ Can login
✅ Dashboard appears

## Quick Troubleshooting

**Build Failing?**
- Check Procfile syntax
- Verify requirements.txt valid
- Check indentation in render.yaml

**Service Not Starting?**
- Check environment variables set
- Verify database credentials
- Review logs in Render dashboard

**Frontend Not finding API?**
- Confirm backend is running
- Check browser console
- Verify backend URL in js/api-client.js

**Database not connecting?**
- Copy full DATABASE_URL from Render
- Paste into backend env variables
- Test connection from logs

## Key Resources

- Docs: `RENDER_DEPLOYMENT.md`
- Checklist: `DEPLOYMENT_CHECKLIST.md`
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- All Ready: `RENDER_READY.md`

## One-Line Deploy (After initial setup)

```bash
git add . && git commit -m "Update" && git push origin main
# Render auto-redeploys!
```

## Support

1. Check Render dashboard logs
2. Read RENDER_DEPLOYMENT.md
3. Review DEPLOYMENT_CHECKLIST.md
4. Check README files
5. Read error messages carefully

---

## You're Ready to Deploy! 🚀

Just push code to GitHub and click deploy on Render.
Total setup time: ~15 minutes
