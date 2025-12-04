# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

This installs:
- `stripe` - Stripe SDK
- `firebase-admin` - Firebase Admin SDK for server-side operations

## 2. Set Up Environment Variables

Create `.env.local` file:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Firebase Admin (get from Firebase Console → Project Settings → Service Accounts)
FIREBASE_CONFIG={"projectId":"...","clientEmail":"...","privateKey":"..."}

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**See `ENV_SETUP.md` for detailed setup instructions.**

## 3. Deploy Firestore Security Rules

**Option A: Firebase Console (Recommended for quick setup)**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Firestore Database → Rules
3. Copy contents from `firestore.rules`
4. Click "Publish"

**Option B: Firebase CLI**
```bash
firebase deploy --only firestore:rules
```

## 4. Set Up Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Developers → Webhooks → Add endpoint
3. URL: `https://your-domain.com/api/webhooks/stripe` (or `http://localhost:3000/api/webhooks/stripe` for local)
4. Events: Select `checkout.session.completed`
5. Copy the **Signing secret** → Use as `STRIPE_WEBHOOK_SECRET`

**For Local Testing:**
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook secret from output
```

## 5. Run the Application

```bash
npm run dev
```

## 6. Test the Flow

1. Navigate to `http://localhost:3000/survey`
2. Fill out the assessment
3. Submit → Should redirect to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete payment
6. Should auto-login and redirect to results

## 7. Verify Everything Works

✅ Check Firestore:
- Assessment created with `paid: false`
- After payment: `paid: true`, `uid` set, user created

✅ Check Firebase Auth:
- User created with email from Stripe

✅ Check Results Page:
- User sees assessment results after auto-login

## Troubleshooting

**"Missing or insufficient permissions"**
→ Deploy Firestore rules (Step 3)

**"Webhook signature verification failed"**
→ Check `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard

**"Firebase Admin initialization error"**
→ Verify `FIREBASE_CONFIG` JSON is valid

**See `TESTING_GUIDE.md` for detailed troubleshooting.**

## Next Steps

- Read `IMPLEMENTATION_SUMMARY.md` for architecture overview
- Read `TESTING_GUIDE.md` for comprehensive testing
- Read `FIRESTORE_MODELS.md` for data structure
- Customize UI/styling as needed

---

**Ready to go!** 🚀

