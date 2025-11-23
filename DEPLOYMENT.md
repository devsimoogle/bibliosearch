# BiblioSearch - Deployment Guide

## 🚀 Deployment Options

This guide covers deploying BiblioSearch to various platforms. Choose the one that best fits your needs.

---

## 1. Vercel (Recommended - Easiest)

**Why Vercel?**
- ✅ Free tier available
- ✅ Automatic deployments from Git
- ✅ Built-in environment variables
- ✅ Global CDN
- ✅ Zero configuration needed

### Deployment Steps:

#### Option A: Deploy with Vercel CLI

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
   # From your project directory
   vercel
   
   # Follow the prompts:
   # - Set up and deploy? Yes
   # - Which scope? (Select your account)
   # - Link to existing project? No
   # - Project name? bibliosearch (or your choice)
   # - Directory? ./ (press Enter)
   # - Override settings? No
   ```

4. **Add Environment Variables**
   ```bash
   # Add your API keys
   vercel env add VITE_GOOGLE_API_KEY
   # Paste your Gemini API key when prompted
   
   # Add other keys as needed
   vercel env add VITE_TAVILY_API_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Option B: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/bibliosearch.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite

3. **Configure Environment Variables**
   - In project settings → Environment Variables
   - Add:
     - `VITE_GOOGLE_API_KEY` = your_gemini_key
     - `VITE_TAVILY_API_KEY` = your_tavily_key (optional)
     - Add other keys as needed

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

---

## 2. Netlify

**Why Netlify?**
- ✅ Free tier available
- ✅ Easy Git integration
- ✅ Form handling
- ✅ Serverless functions support

### Deployment Steps:

1. **Create netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy via Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Initialize and deploy
   netlify init
   
   # Deploy to production
   netlify deploy --prod
   ```

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add your API keys with `VITE_` prefix

4. **Or Deploy via Dashboard**
   - Go to https://app.netlify.com
   - Drag and drop your `dist` folder after running `npm run build`
   - Or connect your Git repository

---

## 3. GitHub Pages

**Why GitHub Pages?**
- ✅ Completely free
- ✅ Integrated with GitHub
- ✅ Custom domain support

### Deployment Steps:

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Update vite.config.ts**
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   
   export default defineConfig({
     plugins: [react()],
     base: '/bibliosearch/', // Replace with your repo name
   })
   ```

3. **Add Deploy Scripts to package.json**
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview",
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `gh-pages`
   - Your site will be at: `https://yourusername.github.io/bibliosearch/`

**Note:** GitHub Pages doesn't support environment variables. You'll need to configure API keys through the admin panel after deployment.

---

## 4. Railway

**Why Railway?**
- ✅ Free tier ($5 credit/month)
- ✅ Easy deployment
- ✅ Database support
- ✅ Automatic HTTPS

### Deployment Steps:

1. **Create railway.json**
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm run preview",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

2. **Deploy**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect and deploy

3. **Add Environment Variables**
   - In project settings → Variables
   - Add your API keys

---

## 5. Render

**Why Render?**
- ✅ Free tier for static sites
- ✅ Automatic deployments
- ✅ Custom domains
- ✅ DDoS protection

### Deployment Steps:

1. **Create render.yaml** (optional)
   ```yaml
   services:
     - type: web
       name: bibliosearch
       env: static
       buildCommand: npm install && npm run build
       staticPublishPath: ./dist
       envVars:
         - key: VITE_GOOGLE_API_KEY
           sync: false
   ```

2. **Deploy**
   - Go to https://render.com
   - Click "New Static Site"
   - Connect your repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Add Environment Variables**
   - In dashboard → Environment
   - Add your API keys

---

## 6. Cloudflare Pages

**Why Cloudflare Pages?**
- ✅ Free unlimited bandwidth
- ✅ Global CDN
- ✅ Fast builds
- ✅ Workers integration

### Deployment Steps:

1. **Deploy via Dashboard**
   - Go to https://pages.cloudflare.com
   - Click "Create a project"
   - Connect your Git repository
   - Build settings:
     - Build command: `npm run build`
     - Build output directory: `dist`

2. **Add Environment Variables**
   - In project settings → Environment variables
   - Add your API keys with `VITE_` prefix

---

## 🔐 Environment Variables Setup

For all platforms, you need to set these environment variables:

### Required:
```
VITE_GOOGLE_API_KEY=your_gemini_api_key
```

### Optional (for enhanced features):
```
VITE_TAVILY_API_KEY=your_tavily_api_key
VITE_GROQ_API_KEY=your_groq_api_key
VITE_SAMBANOVA_API_KEY=your_sambanova_api_key
VITE_MISTRAL_API_KEY=your_mistral_api_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_NEBIUS_API_KEY=your_nebius_api_key
```

---

## 📦 Pre-Deployment Checklist

Before deploying, ensure:

- ✅ All dependencies are in `package.json`
- ✅ Build works locally (`npm run build`)
- ✅ Preview works locally (`npm run preview`)
- ✅ API keys are ready
- ✅ `.env.local` is in `.gitignore`
- ✅ Admin password changed from default
- ✅ All features tested

---

## 🔧 Build Configuration

### Optimizing Build Size

1. **Update vite.config.ts for production**
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   
   export default defineConfig({
     plugins: [react()],
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'react-vendor': ['react', 'react-dom'],
           }
         }
       },
       chunkSizeWarningLimit: 1000,
     }
   })
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Test production build locally**
   ```bash
   npm run preview
   ```

---

## 🌐 Custom Domain Setup

### For Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Netlify:
1. Go to Site Settings → Domain management
2. Add custom domain
3. Configure DNS

### For GitHub Pages:
1. Add `CNAME` file to `public/` folder with your domain
2. Configure DNS to point to GitHub Pages

---

## 🚨 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working
- Ensure they start with `VITE_`
- Restart dev server after adding
- Check platform-specific variable syntax

### API Keys Not Working in Production
- Verify environment variables are set in platform dashboard
- Check for typos in variable names
- Ensure keys are valid and active

### 404 Errors on Refresh
- Add redirect rules (see platform-specific sections)
- Ensure SPA routing is configured

---

## 📊 Platform Comparison

| Platform | Free Tier | Build Time | Ease of Use | Best For |
|----------|-----------|------------|-------------|----------|
| **Vercel** | Yes (100GB bandwidth) | Fast | ⭐⭐⭐⭐⭐ | Production apps |
| **Netlify** | Yes (100GB bandwidth) | Fast | ⭐⭐⭐⭐⭐ | Static sites |
| **GitHub Pages** | Yes (unlimited) | Medium | ⭐⭐⭐⭐ | Open source projects |
| **Railway** | $5 credit/month | Fast | ⭐⭐⭐⭐ | Full-stack apps |
| **Render** | Yes (100GB bandwidth) | Medium | ⭐⭐⭐⭐ | Static sites |
| **Cloudflare** | Yes (unlimited) | Fast | ⭐⭐⭐⭐ | High traffic sites |

---

## 🎯 Recommended Setup

### For Personal/Student Projects:
1. **Deploy to:** Vercel or Netlify (free tier)
2. **API Key:** Google Gemini (free tier)
3. **Domain:** Use provided subdomain or custom domain

### For Institutional Use:
1. **Deploy to:** Vercel Pro or Cloudflare Pages
2. **API Keys:** Google Gemini (paid tier) + Tavily
3. **Domain:** Custom institutional domain
4. **Monitoring:** Set up analytics and error tracking

---

## 🔄 Continuous Deployment

All platforms support automatic deployments:

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Automatic Build & Deploy**
   - Platform detects changes
   - Runs build automatically
   - Deploys to production

---

## 📈 Post-Deployment

### Monitor Your App:
- Set up analytics (Google Analytics, Plausible, etc.)
- Monitor API usage in provider dashboards
- Set up error tracking (Sentry, LogRocket, etc.)
- Configure uptime monitoring

### Optimize Performance:
- Enable caching
- Use CDN features
- Compress images
- Lazy load components

---

## 🆘 Need Help?

- Check platform-specific documentation
- See API_KEYS_GUIDE.md for API setup
- Open an issue on GitHub
- Check deployment logs for errors

---

**Recommended Quick Start:** Deploy to Vercel with Google Gemini API for the fastest, easiest setup!
