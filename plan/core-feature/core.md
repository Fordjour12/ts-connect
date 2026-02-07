# Core Feature PRD

## 1) Purpose

Define the non-negotiable core of the app so every user can:

- Create an account and securely access their workspace.
- Complete minimum financial onboarding.
- Start from privacy-safe defaults without sharing unnecessary data.

This PRD covers only the foundation layer. Advanced budgeting, analytics, and automation are out of scope for this phase.

## 2) Product Goals

- Provide a fast onboarding flow that can be completed in under 2 minutes.
- Capture the minimum profile required to personalize financial calculations.
- Keep user data private by default and avoid collecting data not needed for core value.
- Ensure core setup is stable enough for future modules to build on.

## 3) Non-Goals (For This Phase)

- Bank account linking.
- Transaction ingestion or categorization.
- Investment tracking.
- Shared/family workspaces.
- AI recommendations.

## 4) Core User Stories

1. As a new user, I can sign up and log in securely.
2. As an authenticated user, I can set my preferred currency.
3. As an authenticated user, I can set a financial start date.
4. As an authenticated user, I can optionally set monthly income baseline.
5. As a privacy-conscious user, my account defaults to minimal data sharing.
6. As a returning user, I can edit onboarding values later in settings.

## 5) Functional Requirements

### 5.1 Authentication and Session

- Use Better Auth for sign up, sign in, sign out, and session retrieval.
- Support email/password authentication at minimum.
- Redirect unauthenticated users from protected routes to `/login`.
- Successful sign up/sign in routes users to `/dashboard`.
- Session-aware UI states:
  - Loading state while checking session.
  - Clear error toast on auth failure.

### 5.2 User Financial Profile Setup

Required profile fields on onboarding:

- `currency` (required).
- `financialStartDate` (required).

Optional profile fields on onboarding:

- `monthlyIncomeMin` (optional).
- `monthlyIncomeMax` (optional).

Rules:

- Currency must be a supported ISO currency code from an app-defined list.
- Financial start date cannot be in the future.
- If one income bound is provided, both must be required.
- `monthlyIncomeMin <= monthlyIncomeMax`.
- All income values are non-negative numbers.

### 5.3 Privacy-First Defaults

Default account behavior on user creation:

- Data visibility: private.
- No public profile exposure.
- No third-party data sync enabled.
- Analytics/telemetry off unless explicitly opted in (if telemetry exists).
- Least-privilege data retention for onboarding fields only.

### 5.4 Profile Editability

- Users can update currency and start date at any time in settings.
- Users can add, change, or remove monthly income range.
- Changes are auditable via `updatedAt` timestamps.

## 6) UX Requirements

### 6.1 Onboarding Flow

1. User signs up or logs in.
2. If profile is incomplete, redirect to onboarding.
3. Collect required fields first (currency, start date).
4. Prompt optional monthly income range.
5. Confirm privacy defaults with concise copy.
6. Continue to dashboard.

### 6.2 UX Quality Bar

- Form validation should be immediate and specific.
- Do not block progress for optional income range.
- Use loading indicators for network calls.
- No blank screens during auth/session transitions.

## 7) Data Model (Initial)

Add a user-profile table or equivalent extension linked 1:1 to auth user:

- `userId` (PK/FK to auth user)
- `currency` (string, required)
- `financialStartDate` (date, required)
- `monthlyIncomeMin` (decimal, nullable)
- `monthlyIncomeMax` (decimal, nullable)
- `privacyMode` (enum/string, default `private`)
- `telemetryOptIn` (boolean, default `false`)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## 8) API / Server Function Requirements

- `getUserProfile` (auth required).
- `upsertUserProfile` (auth required).
- `updatePrivacySettings` (auth required).

Constraints:

- All handlers must enforce session ownership (`session.user.id` match).
- No cross-user reads/writes.
- Return typed validation errors for form mapping.

## 9) Security and Privacy Requirements

- Enforce authentication on all profile endpoints.
- Validate and sanitize all user input server-side.
- Avoid logging sensitive user financial values in plaintext.
- Use secure cookie/session settings via Better Auth defaults.
- Collect only fields defined in this PRD for core onboarding.

## 10) Success Metrics

- `onboarding_completion_rate` >= 80% for newly registered users.
- Median onboarding completion time <= 2 minutes.
- Auth success rate >= 98% (excluding wrong credentials).
- Profile save error rate < 2%.

## 11) Acceptance Criteria

1. New user can sign up, sign in, and sign out successfully.
2. Protected routes reject unauthenticated access and redirect to `/login`.
3. Onboarding cannot complete without currency and valid financial start date.
4. Optional income range saves only when both min and max are valid.
5. New accounts default to privacy mode `private` and telemetry opt-in `false`.
6. Returning users can edit onboarding fields from settings.
7. Data persists and is visible after re-login.
8. All server writes are scoped to the authenticated user only.

## 12) Implementation Phases

### Phase 1: Auth Stability

- Confirm Better Auth flows and route protection.
- Ensure robust pending/error states in login/signup.

### Phase 2: Profile Schema + APIs

- Add DB schema for user profile fields.
- Implement validated server functions for read/write.

### Phase 3: Onboarding UI

- Build onboarding route and form flow.
- Enforce required vs optional validation rules.

### Phase 4: Settings and Edit Flow

- Add settings UI for profile updates.
- Persist and display updated values on dashboard/profile surfaces.

### Phase 5: Instrumentation

- Add metrics for onboarding funnel and save failures.
- Confirm privacy defaults are applied for all new users.

## 13) Dependencies

- `@ts-connnect/auth` for session and auth lifecycle.
- `@ts-connnect/db` for schema and persistence.
- `@ts-connnect/env` for runtime configuration.
- TanStack Start server functions and route guards.

## 14) Risks and Mitigations

- Risk: onboarding drop-off from too many required fields.
  - Mitigation: keep only currency + start date mandatory.
- Risk: inconsistent currency handling later.
  - Mitigation: lock to supported currency enum now.
- Risk: future privacy requirements change.
  - Mitigation: centralize privacy settings in profile model and middleware.

## 15) Open Questions

1. Which initial currency list should be supported at launch?
2. Should financial start date default to account creation date or remain blank?
3. Do we need locale-aware currency formatting in onboarding phase?
4. Is telemetry opt-in needed now, or should it be deferred entirely?
