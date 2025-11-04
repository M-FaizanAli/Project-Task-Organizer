# Deployment Guide for Vercel

## Environment Variables

**You currently have NO environment variables configured.** This is fine for this project as it doesn't require any.

## Deployment Checklist

### 1. Vercel Project Settings

In your Vercel project dashboard, verify:

- **Framework Preset**: None (or Other)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2. Build Configuration

The project is configured with:
- ✅ Output directory: `dist` (Vercel expects this)
- ✅ Base path: `/` (for root domain deployment)
- ✅ SPA routing configured in `vercel.json`

### 3. Troubleshooting Blank Page

If the page is still blank after deployment:

#### Check Browser Console (F12)
1. Open your deployed site
2. Press F12 to open Developer Tools
3. Go to the **Console** tab
4. Look for any red error messages
5. Go to the **Network** tab and check if assets are loading (status 200)

#### Common Issues:

**Issue 1: Assets Not Loading (404 errors)**
- Check Network tab in browser console
- Verify assets are being served from `/assets/` path
- Solution: Ensure `vercel.json` is correctly configured

**Issue 2: JavaScript Errors**
- Check Console tab for errors
- The updated `main.tsx` now shows errors on screen if rendering fails

**Issue 3: Build Failed**
- Check Vercel deployment logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### 4. Verify Deployment

After deploying, check:

1. ✅ Build completes successfully (no errors in Vercel logs)
2. ✅ `dist` folder is created with `index.html` and `assets/` folder
3. ✅ Browser console shows no errors
4. ✅ Network tab shows all assets loading (200 status)

### 5. Manual Verification

To test locally before deploying:

```bash
npm run build
npx serve dist
```

Then open `http://localhost:3000` (or the port shown) to verify the build works locally.

## Current Configuration Files

- `vercel.json` - Vercel deployment configuration
- `vite.config.ts` - Vite build configuration (outputs to `dist`)
- `package.json` - Dependencies and build scripts

## Need Help?

If still having issues:
1. Share the browser console errors (F12 → Console tab)
2. Share Vercel deployment logs
3. Check if assets are loading in Network tab

