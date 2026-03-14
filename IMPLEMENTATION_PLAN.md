# Viblog - Implementation Plan

## 1. Overview

This document provides a step-by-step build sequence for Viblog. Each step has clear deliverables and dependencies.

**Current Status:** MVP v0.1.0 Released (2026-03-13), Post-MVP in progress

---

## 2. Development Phases

```
MVP Phases (Completed)
├── Phase 1: Foundation
├── Phase 2: Core Features
├── Phase 3: Public Features
└── Phase 4: Polish & Deploy

Post-MVP Phases
├── Phase 5: Custom Domain (Completed 2026-03-14)
├── Phase 6: Test Coverage to 80% (Current)
├── Phase 7: E2E Test Suite
└── Phase 8: Fix Onboarding Data Usage
```

---

## 3. Current Phase: Phase 6 - Test Coverage to 80%

**Goal:** Achieve 80%+ test coverage for all production code

**Estimated Effort:** 8-10 hours

**Dependencies:** None (can start immediately)

---

### Step 6.1: Create Test Utilities
**Status:** Pending

**Deliverable:** Reusable test utilities file with mock factories

**Tasks:**
- [ ] Create `src/test/test-utils.tsx` with custom render function
- [ ] Add mock factories for User, Project, Article types
- [ ] Create mock Supabase client helpers
- [ ] Add MSW handlers for API mocking

**Files to Create/Modify:**
```
src/test/
├── test-utils.tsx (new)
├── mocks/
│   ├── supabase.ts (new)
│   └── handlers.ts (new)
└── factories/
    ├── user.ts (new)
    ├── project.ts (new)
    └── article.ts (new)
```

---

### Step 6.2: Unit Tests for Utilities
**Status:** Pending

**Deliverable:** Tests for all utility functions

**Tasks:**
- [ ] Test `src/lib/utils.ts` - cn() function
- [ ] Test any date formatting utilities
- [ ] Test slug generation functions
- [ ] Test validation helpers

**Files to Create:**
```
src/lib/
└── utils.test.ts (new)
```

---

### Step 6.3: Unit Tests for Form Validation
**Status:** Pending

**Deliverable:** Tests for all form validation schemas

**Tasks:**
- [ ] Test login form validation
- [ ] Test register form validation
- [ ] Test project form validation
- [ ] Test article form validation

**Files to Create:**
```
src/components/auth/
├── login-form.test.tsx (new)
└── register-form.test.tsx (new)
src/components/projects/
└── project-form.test.tsx (new)
```

---

### Step 6.4: Component Tests for Forms
**Status:** Pending

**Deliverable:** Tests for form components

**Tasks:**
- [ ] Test login form interactions
- [ ] Test register form interactions
- [ ] Test project form interactions
- [ ] Test article form interactions
- [ ] Test publish modal interactions

**Files to Create:**
```
src/components/articles/
├── article-form.test.tsx (new)
└── publish-modal.test.tsx (new)
```

---

### Step 6.5: Integration Tests for Auth API
**Status:** Pending

**Deliverable:** Tests for authentication API routes

**Tasks:**
- [ ] Test POST /api/auth/login
- [ ] Test POST /api/auth/register
- [ ] Test GET /api/auth/callback
- [ ] Test error handling

**Files to Create:**
```
src/app/api/auth/
├── login/route.test.ts (new)
├── register/route.test.ts (new)
└── callback/route.test.ts (new)
```

---

### Step 6.6: Integration Tests for Project API
**Status:** Pending

**Deliverable:** Tests for project API routes

**Tasks:**
- [ ] Test GET /api/projects
- [ ] Test POST /api/projects
- [ ] Test PUT /api/projects/[id]
- [ ] Test DELETE /api/projects/[id]

**Files to Create:**
```
src/app/api/projects/
├── route.test.ts (new)
└── [id]/route.test.ts (new)
```

---

### Step 6.7: Integration Tests for Article API
**Status:** Pending

**Deliverable:** Tests for article API routes

**Tasks:**
- [ ] Test GET /api/articles
- [ ] Test POST /api/articles
- [ ] Test PUT /api/articles/[id]
- [ ] Test DELETE /api/articles/[id]
- [ ] Test POST /api/articles/[id]/publish

**Files to Create:**
```
src/app/api/articles/
├── route.test.ts (new)
├── [id]/route.test.ts (new)
└── [id]/publish/route.test.ts (new)
```

---

### Step 6.8: Coverage Report and Gap Filling
**Status:** Pending

**Deliverable:** 80%+ coverage report

**Tasks:**
- [ ] Run `pnpm test --coverage`
- [ ] Analyze coverage report
- [ ] Add tests for uncovered lines
- [ ] Verify 80%+ coverage achieved
- [ ] Document coverage baseline in CHANGELOG

**Command:**
```bash
pnpm test --coverage
```

---

## 4. Phase 5: Custom Domain (Completed)

**Completed:** 2026-03-14

**What was done:**
- Configured DNS in DNSPod (CNAME: viblog -> cname.vercel-dns.com)
- Added domain in Vercel Dashboard
- Updated environment variables
- Fixed build error by converting vitest.config.ts to JS

---

## 5. Phase 7: E2E Test Suite (Planned)

**Goal:** Create automated E2E tests for critical user flows

**Estimated Effort:** 5-6 hours

**Dependencies:** Phase 6 completion

**Planned Steps:**
- Step 7.1: Configure Playwright
- Step 7.2: Create test utilities and fixtures
- Step 7.3: E2E test for registration flow
- Step 7.4: E2E test for login flow
- Step 7.5: E2E test for article creation
- Step 7.6: E2E test for article publishing
- Step 7.7: Add CI/CD integration

---

## 6. Phase 8: Fix Onboarding Data Usage (Planned)

**Goal:** Actually store and use LLM API keys collected during onboarding

**Estimated Effort:** 4-5 hours

**Dependencies:** Phase 6 completion

**Planned Steps:**
- Step 8.1: Design secure storage for API keys
- Step 8.2: Update onboarding to encrypt and store keys
- Step 8.3: Create API route to retrieve keys securely
- Step 8.4: Update settings page to manage keys
- Step 8.5: Add tests for key management

---

## 7. MVP Implementation (Completed)

### Phase 1: Foundation (Completed)

#### Step 1.1: Initialize Project
**Status:** Completed
**Deliverable:** Working Next.js project with TypeScript

#### Step 1.2: Configure Supabase Client
**Status:** Completed
**Deliverable:** Working Supabase connection

#### Step 1.3: Set Up Database Schema
**Status:** Completed
**Deliverable:** Complete database tables with RLS policies

#### Step 1.4: Build Authentication
**Status:** Completed
**Deliverable:** Working login/register flow

#### Step 1.5: Build Onboarding Flow
**Status:** Completed
**Deliverable:** 5-step onboarding wizard

---

### Phase 2: Core Features (Completed)

#### Step 2.1: Build Dashboard Layout
**Status:** Completed
**Deliverable:** Dashboard with sidebar navigation

#### Step 2.2: Build Project Management
**Status:** Completed
**Deliverable:** Full CRUD for projects

#### Step 2.3: Build Article Management
**Status:** Completed
**Deliverable:** Full CRUD for articles with rich text editor

#### Step 2.4: Build Timeline View
**Status:** Completed
**Deliverable:** Timeline showing projects and articles

---

### Phase 3: Public Features (Completed)

#### Step 3.1: Build Public Feed
**Status:** Completed
**Deliverable:** Landing page with article cards

#### Step 3.2: Build Article Detail Page
**Status:** Completed
**Deliverable:** Full article view with metadata

#### Step 3.3: Build User Profile Pages
**Status:** Completed
**Deliverable:** Public profile with article list

---

### Phase 4: Polish & Deploy (Completed)

#### Step 4.1: UI Polish
**Status:** Completed
**Deliverable:** Consistent, polished UI

#### Step 4.2: Testing
**Status:** Completed
**Deliverable:** Basic test coverage (23 tests)

#### Step 4.3: Deployment
**Status:** Completed
**Deliverable:** Live application on Vercel

---

## 8. Dependency Graph

```
MVP (Completed)
├── Phase 1: Foundation
│   └── Phase 2: Core Features
│       └── Phase 3: Public Features
│           └── Phase 4: Polish & Deploy

Post-MVP
├── Phase 5: Custom Domain (Completed)
└── Phase 6: Test Coverage
    ├── Phase 7: E2E Test Suite
    └── Phase 8: Fix Onboarding Data Usage
```

---

## 9. Environment Setup Checklist

- [x] Node.js 20+ installed
- [x] pnpm installed
- [x] Supabase account created
- [x] Supabase project created
- [x] Vercel account created
- [x] Custom domain configured (viblog.tiic.tech)
- [x] Git repository initialized

---

**Document Version:** 2.0
**Last Updated:** 2026-03-14