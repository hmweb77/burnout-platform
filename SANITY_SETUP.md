# Sanity Studio Setup Guide

## Installation

After running `npm install`, Sanity Studio will be available at `/admin` route.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Where to Get Your Sanity Credentials

1. **Create a Sanity Account:**
   - Go to [sanity.io](https://www.sanity.io/)
   - Sign up or log in

2. **Create a New Project:**
   - Go to [sanity.io/manage](https://www.sanity.io/manage)
   - Click "Create project"
   - Choose a project name
   - Select a dataset name (usually "production")

3. **Get Your Project ID:**
   - In your Sanity project dashboard
   - Go to Settings → API
   - Copy the "Project ID"

4. **Get Your Dataset:**
   - In the same API settings page
   - You'll see your dataset name (usually "production")

## Adding Credentials to .env.local

1. Open `.env.local` in your project root
2. Add the following lines:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
```

Replace `abc123xyz` with your actual Project ID from Sanity.

## Accessing the Admin Dashboard

Once configured, visit:
- **Local:** `http://localhost:3000/admin`
- **Production:** `https://your-domain.com/admin`

## Schemas Created

### Blog Schema
- **Title** (string, required)
- **Slug** (auto-generated from title, required)
- **Cover Image** (image with hotspot, required)
- **Content** (rich text blocks with images, required)
- **Published At** (datetime, required)

### Resource Schema
- **Name** (string, required)
- **Price** (number, required, min: 0)
- **Description** (text, required)
- **Image** (image with hotspot, required)
- **PDF File** (file, PDF only, required)

## Next Steps

1. Install dependencies: `npm install`
2. Add environment variables to `.env.local`
3. Restart your dev server: `npm run dev`
4. Visit `http://localhost:3000/admin`
5. Start creating blogs and resources!

## Troubleshooting

**Studio doesn't load:**
- Check that environment variables are set correctly
- Restart your dev server after adding env variables
- Check browser console for errors

**Can't see schemas:**
- Verify `sanity.config.js` imports the schemas correctly
- Check that schema files exist in `src/schemas/`

**Images not loading:**
- Ensure `cdn.sanity.io` is in `next.config.js` images domains
- Check Sanity project has proper CORS settings

