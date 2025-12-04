# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook signing secret from Stripe Dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
STRIPE_PRICE_ID=price_... # Your Stripe price ID for the assessment
NEXT_PUBLIC_STRIPE_PRICE_ID=price_... # Same as above (for client-side fallback)

# Firebase Configuration
# Option 1: JSON string (recommended for server-side)
FIREBASE_CONFIG={"projectId":"your-project-id","clientEmail":"firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com","privateKey":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"}

# Option 2: Individual variables (alternative)
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000 # Your app URL (auto-detected on Vercel)
```

## Firebase Admin SDK Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Extract the following from the JSON:
   - `project_id` → `projectId`
   - `client_email` → `clientEmail`
   - `private_key` → `privateKey`

7. Create the `FIREBASE_CONFIG` JSON string:
```json
{
  "projectId": "your-project-id",
  "clientEmail": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "privateKey": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

**Important:** Keep the `\n` characters in the private key string.

## Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your **API Keys** from **Developers** → **API keys**
3. Create a **Product** and **Price** for your assessment
4. Copy the **Price ID** (starts with `price_`)
5. Set up webhook endpoint:
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen: `checkout.session.completed`
   - Copy the **Signing secret** (starts with `whsec_`)

## Local Development with Stripe Webhooks

Use Stripe CLI to forward webhooks to your local server:

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Windows: Download from https://github.com/stripe/stripe-cli/releases

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret shown in the output
# Use it as STRIPE_WEBHOOK_SECRET in .env.local
```

## Vercel Deployment

1. Add all environment variables in **Vercel Dashboard** → **Settings** → **Environment Variables**
2. For `FIREBASE_CONFIG`, paste the entire JSON string as a single value
3. Redeploy after adding variables

## Security Notes

- Never commit `.env.local` to version control
- Add `.env.local` to `.gitignore`
- Use different Stripe keys for development and production
- Rotate webhook secrets if compromised
- Keep Firebase Admin private key secure

