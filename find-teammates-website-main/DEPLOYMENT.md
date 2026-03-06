# 🚀 CollabNest Deployment Guide

Complete guide to deploy CollabNest frontend and backend to production.

---

## 📦 Frontend Deployment

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration for React apps
- Automatic HTTPS
- Global CDN
- Instant rollbacks
- Preview deployments for PRs

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables** (in Vercel Dashboard)
   - Go to Settings → Environment Variables
   - Add `VITE_API_URL=https://your-backend-url.com`

**Alternative: GitHub Integration**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel auto-detects React and deploys

---

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Configure redirects** for React Router
   
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

**Alternative: Drag & Drop**
1. Build: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag `dist` folder to deploy

---

### Option 3: GitHub Pages

**Steps:**

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/collabnest",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/collabnest/',
     // ... other config
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

---

## 🖥 Backend Deployment

### Option 1: Railway (Recommended)

**Why Railway?**
- Easy PostgreSQL database setup
- Automatic deployments from GitHub
- Free tier available
- Built-in monitoring

**Steps:**

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your backend repository

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically sets `DATABASE_URL`

4. **Configure Environment Variables**
   - Go to your service settings
   - Add variables:
     ```
     JWT_SECRET=your-super-secret-key
     JWT_EXPIRES_IN=7d
     OPENAI_API_KEY=sk-your-key
     FRONTEND_URL=https://your-frontend.vercel.app
     NODE_ENV=production
     ```

5. **Deploy**
   - Railway auto-deploys on git push
   - Get your public URL from dashboard

---

### Option 2: Render

**Steps:**

1. **Sign up at [render.com](https://render.com)**

2. **Create PostgreSQL Database**
   - New → PostgreSQL
   - Note the Internal Database URL

3. **Create Web Service**
   - New → Web Service
   - Connect your GitHub repo
   - Configure:
     - **Name**: collabnest-api
     - **Environment**: Node
     - **Build Command**: `npm install && npx prisma generate && npm run build`
     - **Start Command**: `npm start`

4. **Add Environment Variables**
   - DATABASE_URL (from step 2)
   - JWT_SECRET
   - OPENAI_API_KEY
   - FRONTEND_URL
   - NODE_ENV=production

5. **Deploy**
   - Render auto-deploys on git push

---

### Option 3: Heroku

**Steps:**

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create collabnest-api
   ```

4. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret
   heroku config:set OPENAI_API_KEY=sk-your-key
   heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. **Add Procfile**
   ```
   web: npm start
   release: npx prisma migrate deploy
   ```

7. **Deploy**
   ```bash
   git push heroku main
   ```

---

### Option 4: Digital Ocean App Platform

**Steps:**

1. **Create App**
   - Go to [DigitalOcean](https://www.digitalocean.com)
   - Apps → Create App
   - Connect GitHub repository

2. **Add Database**
   - Add Component → Database → PostgreSQL
   - Bind to your app

3. **Configure**
   - Build command: `npm install && npx prisma generate && npm run build`
   - Run command: `npm start`
   - Add environment variables

4. **Deploy**
   - Auto-deploys on push

---

## 🗄 Database Options

### Option 1: Supabase (Recommended for Hackathons)

**Why Supabase?**
- PostgreSQL with free tier
- Built-in auth (can replace custom JWT)
- Real-time subscriptions
- Auto-generated REST API
- Storage for profile images

**Setup:**

1. **Create Project** at [supabase.com](https://supabase.com)
2. **Get Connection String**
   - Settings → Database → Connection string
   - Use "Connection pooling" string for serverless
3. **Update .env**
   ```
   DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```

---

### Option 2: Neon

**Fast, serverless PostgreSQL**

1. Sign up at [neon.tech](https://neon.tech)
2. Create project
3. Copy connection string
4. Add to `.env`

---

### Option 3: PlanetScale

**MySQL alternative (requires Prisma adapter)**

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Update Prisma schema to use MySQL

---

## 🔐 Production Security Checklist

### Frontend

- [ ] Remove console.logs
- [ ] Enable production mode
- [ ] Set secure CORS origins
- [ ] Use environment variables for API URLs
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Add CSP headers
- [ ] Implement rate limiting on forms

### Backend

- [ ] Use strong JWT secret (min 32 characters)
- [ ] Hash passwords with bcrypt (10+ rounds)
- [ ] Enable HELMET for security headers
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Validate all inputs
- [ ] Use parameterized queries (Prisma handles this)
- [ ] Set NODE_ENV=production
- [ ] Hide error stack traces in production
- [ ] Enable HTTPS
- [ ] Set secure cookie flags

---

## 📊 Monitoring & Analytics

### Frontend Analytics

**Google Analytics**
```typescript
// In index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Alternative: Plausible Analytics** (Privacy-focused)
```html
<script defer data-domain="collabnest.com" src="https://plausible.io/js/script.js"></script>
```

### Backend Monitoring

**Sentry** (Error tracking)
```bash
npm install @sentry/node
```

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**LogTail** (Logging)
```bash
npm install @logtail/node
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      # Deploy to Railway/Render/Heroku
```

---

## 🧪 Pre-Deployment Testing

```bash
# Frontend
npm run build
npm run preview  # Test production build locally

# Backend
npm run build
NODE_ENV=production node dist/index.js
```

---

## 📈 Performance Optimization

### Frontend

1. **Code Splitting**
   ```typescript
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   ```

2. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Add loading skeletons

3. **Bundle Analysis**
   ```bash
   npm install -D vite-bundle-visualizer
   ```

### Backend

1. **Database Indexing**
   - Add indexes to frequently queried fields
   - Use Prisma `@@index`

2. **Caching**
   ```bash
   npm install redis
   ```

3. **Compression**
   ```bash
   npm install compression
   ```
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

---

## 🎯 Domain Setup

### Custom Domain

1. **Buy domain** (Namecheap, GoDaddy, etc.)

2. **Vercel**
   - Settings → Domains → Add
   - Update DNS records:
     ```
     A     @    76.76.21.21
     CNAME www  cname.vercel-dns.com
     ```

3. **Backend (Railway/Render)**
   - Add custom domain in dashboard
   - Update DNS CNAME record

---

## 📞 Post-Deployment

1. **Test all features**
   - Login/Signup
   - Matching algorithm
   - AI tools
   - Resource hub

2. **Monitor errors** (Sentry)

3. **Check performance** (Lighthouse, GTmetrix)

4. **Set up backups** (automated database backups)

5. **Create status page** (status.collabnest.com)

---

## 🆘 Troubleshooting

### Common Issues

**Frontend not connecting to backend**
- Check CORS configuration
- Verify API URL in frontend .env
- Check browser console for errors

**Database connection failed**
- Verify DATABASE_URL
- Check if database allows external connections
- Run `npx prisma migrate deploy`

**JWT errors**
- Ensure JWT_SECRET is same on all instances
- Check token expiration settings

**OpenAI API errors**
- Verify API key
- Check billing/quota
- Add error handling for API failures

---

## ✅ Deployment Checklist

### Pre-Launch
- [ ] All features tested
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] HTTPS enabled
- [ ] Analytics setup
- [ ] Error tracking setup
- [ ] Backups configured

### Launch
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Test production endpoints
- [ ] Monitor error logs
- [ ] Check performance

### Post-Launch
- [ ] Monitor uptime
- [ ] Track user analytics
- [ ] Review error reports
- [ ] Optimize based on metrics
- [ ] Document issues/fixes

---

**Your app is now live! 🎉**

Share it with the world:
- Twitter: "Just launched CollabNest! 🚀"
- Product Hunt: Submit your product
- Reddit: r/webdev, r/reactjs
- Dev.to: Write a blog post

**Good luck with your hackathon! 🏆**
