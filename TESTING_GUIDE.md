# Testing Guide - Paid Assessment Workflow

## Prerequisites

1. ✅ All environment variables configured (see `ENV_SETUP.md`)
2. ✅ Firebase Admin SDK initialized
3. ✅ Stripe test mode enabled
4. ✅ Firestore security rules deployed
5. ✅ Webhook endpoint configured

## Test Flow Checklist

### 1. Submit Assessment

**Test:** User submits assessment without login

1. Navigate to `/survey`
2. Fill out all questions
3. Submit the form
4. **Expected:** 
   - Assessment saved to Firestore with `paid: false`
   - Redirected to Stripe Checkout page
   - Check Firestore: `assessments/{assessmentId}` exists

**Verify in Firestore:**
```javascript
// Check assessment document
{
  answers: { ... },
  paid: false,
  status: "pending_payment",
  createdAt: <timestamp>
}
```

### 2. Stripe Checkout

**Test:** Complete payment in Stripe

1. On Stripe Checkout page
2. Use test card: `4242 4242 4242 4242`
3. Expiry: Any future date
4. CVC: Any 3 digits
5. Click "Pay"
6. **Expected:** Redirected to `/payment-success?session_id=...&assessment_id=...`

### 3. Webhook Processing

**Test:** Verify webhook updates Firestore

**Using Stripe CLI (Local):**
```bash
# Terminal 1: Start webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 2: Trigger test event
stripe trigger checkout.session.completed
```

**Expected in Firestore:**
```javascript
// Assessment document updated
{
  paid: true,                    // ✅ Changed
  paidAt: <timestamp>,           // ✅ Added
  uid: "firebase-user-id",       // ✅ Added
  email: "test@example.com",     // ✅ Added
  stripeSessionId: "cs_test_...", // ✅ Added
  status: "completed"           // ✅ Changed
}

// User document created
users/{userId}: {
  email: "test@example.com",
  assessments: ["assessmentId"],
  createdAt: <timestamp>
}

// Survey subcollection created
users/{userId}/surveys/{assessmentId}: {
  answers: { ... },
  submittedAt: <timestamp>,
  paidAt: <timestamp>,
  source: "paid_assessment"
}
```

### 4. Auto-Login Flow

**Test:** User auto-signed in after payment

1. Complete payment in Stripe
2. Redirected to `/payment-success`
3. **Expected:**
   - Payment verified
   - Custom token received
   - User signed in automatically
   - Redirected to `/results?assessmentId=...`
   - User sees assessment results

**Verify:**
- Check browser console for "User signed in" message
- Check Firebase Auth: User should be logged in
- Results page should display assessment data

### 5. Cancel Flow

**Test:** User cancels payment

1. Start checkout process
2. Click "Cancel" or close Stripe window
3. **Expected:**
   - Redirected to `/checkout?assessmentId=...`
   - Assessment remains `paid: false`
   - User can retry payment

### 6. Retry Payment

**Test:** Retry payment for unpaid assessment

1. Navigate to `/checkout?assessmentId={unpaidAssessmentId}`
2. Click "Retry Payment" (if implemented)
3. **Expected:**
   - New Stripe checkout session created
   - Same assessment ID used
   - Payment can be completed

### 7. Already Paid Check

**Test:** Prevent duplicate payments

1. Try to create checkout for already paid assessment
2. **Expected:**
   - API returns error: "Assessment already paid"
   - No new checkout session created

## Stripe Test Cards

| Card Number | Description |
|------------|-------------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0025 0000 3155` | Requires authentication |

## Webhook Testing

### Local Testing with Stripe CLI

```bash
# 1. Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Windows: Download from GitHub

# 2. Login
stripe login

# 3. Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 4. Copy webhook secret from output
# Use as STRIPE_WEBHOOK_SECRET in .env.local

# 5. Trigger test events
stripe trigger checkout.session.completed
```

### Production Testing

1. Go to Stripe Dashboard → Webhooks
2. Find your endpoint
3. Click "Send test webhook"
4. Select `checkout.session.completed`
5. Check server logs and Firestore

## Common Issues & Solutions

### Issue: "Missing or insufficient permissions"

**Solution:** Deploy Firestore security rules
```bash
firebase deploy --only firestore:rules
```

### Issue: "Webhook signature verification failed"

**Solution:** 
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Ensure webhook body is not parsed (raw body)

### Issue: "Firebase Admin initialization error"

**Solution:**
- Verify `FIREBASE_CONFIG` JSON is valid
- Check private key includes `\n` characters
- Ensure service account has proper permissions

### Issue: "User not created by webhook"

**Solution:**
- Check webhook logs in Stripe Dashboard
- Verify webhook endpoint is accessible
- Check Firebase Admin SDK initialization

### Issue: "Custom token not received"

**Solution:**
- Verify payment status is "paid"
- Check `/api/payment/verify` endpoint logs
- Ensure user exists in Firebase Auth

## Verification Checklist

- [ ] Assessment saved with `paid: false`
- [ ] Stripe checkout session created
- [ ] Webhook receives `checkout.session.completed`
- [ ] Assessment updated to `paid: true`
- [ ] Firebase user created/retrieved
- [ ] Assessment linked to user
- [ ] User document created in Firestore
- [ ] Survey copied to user's subcollection
- [ ] Custom token generated
- [ ] User auto-signed in
- [ ] Results page displays correctly
- [ ] Cancel flow works
- [ ] Retry payment works
- [ ] Duplicate payment prevented

## Production Checklist

Before going live:

- [ ] Switch to Stripe live mode keys
- [ ] Update webhook endpoint to production URL
- [ ] Test with real payment (small amount)
- [ ] Verify webhook signature in production
- [ ] Check Firestore security rules
- [ ] Monitor error logs
- [ ] Set up error alerts
- [ ] Test email notifications (if implemented)
- [ ] Verify auto-login works in production
- [ ] Test on mobile devices

