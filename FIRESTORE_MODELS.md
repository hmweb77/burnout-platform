# Firestore Data Models

## Assessments Collection

**Path:** `assessments/{assessmentId}`

```javascript
{
  // Assessment answers (required)
  answers: {
    physicalWellbeing: [1, 2, 3],        // Array of integers (1-5)
    emotionalWellbeing: [4, 5, 3],
    mindsetWellbeing: [2, 4, 5],
    lifestyleBalance: [3, 4, 2]
  },
  
  // Payment status (required)
  paid: false,                           // Boolean - set to true by webhook
  
  // User information
  email: "user@example.com",            // String - from Stripe checkout
  uid: "firebase-user-id",               // String - set by webhook after user creation
  anonymousId: "anon_123...",            // String - client-side session ID
  
  // Stripe information (set by webhook)
  stripeSessionId: "cs_test_...",        // String - Stripe checkout session ID
  stripeCustomerId: "cus_...",          // String - Stripe customer ID
  
  // Timestamps
  createdAt: Timestamp,                  // Firestore Timestamp
  paidAt: Timestamp,                     // Firestore Timestamp - set by webhook
  
  // Status
  status: "pending_payment" | "completed" // String
}
```

## Users Collection

**Path:** `users/{userId}`

```javascript
{
  // User information
  email: "user@example.com",            // String - from Firebase Auth
  
  // Assessment tracking
  assessments: ["assessmentId1", "assessmentId2"], // Array of assessment IDs
  
  // Timestamps
  createdAt: Timestamp,                  // Firestore Timestamp
  lastLoginAt: Timestamp                 // Firestore Timestamp
}
```

## User Surveys Subcollection

**Path:** `users/{userId}/surveys/{surveyId}`

```javascript
{
  // Assessment answers (copied from assessments collection)
  answers: {
    physicalWellbeing: [1, 2, 3],
    emotionalWellbeing: [4, 5, 3],
    mindsetWellbeing: [2, 4, 5],
    lifestyleBalance: [3, 4, 2]
  },
  
  // Metadata
  submittedAt: Timestamp,                 // Firestore Timestamp
  paidAt: Timestamp,                     // Firestore Timestamp
  source: "paid_assessment"               // String - indicates source
}
```

## Indexes Required

No composite indexes required for basic queries. If you add filtering/sorting, create indexes in Firebase Console.

## Security Rules

See `firestore.rules` file. Key points:
- Assessments: Server-side writes only (via Admin SDK)
- Users: Authenticated users can read/write their own data
- Surveys: Authenticated users can read/write their own surveys

