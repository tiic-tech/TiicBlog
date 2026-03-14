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

**Current Status:** In Progress (17.04% coverage, 113 tests)

---

### Step 6.1: Create Test Utilities
**Status:** Completed

**Deliverable:** Reusable test utilities file with mock factories

**Files Created:**
- `src/test/test-utils.tsx` - Custom render function
- `src/test/factories/user.ts` - User mock factory
- `src/test/factories/project.ts` - Project mock factory
- `src/test/factories/article.ts` - Article mock factory
- `src/test/mocks/supabase.ts` - Supabase client mock

---

### Step 6.2: Unit Tests for Utilities
**Status:** Completed

**Deliverable:** Tests for all utility functions

---

### Step 6.3: Unit Tests for Form Validation
**Status:** Completed

**Deliverable:** Tests for all form validation schemas (43 tests)

---

### Step 6.4: Component Tests for Forms
**Status:** Completed

**Deliverable:** Tests for form components (17 tests)

---

### Step 6.5: Integration Tests for Auth API
**Status:** Completed (merged into API tests)

---

### Step 6.6: Integration Tests for Project API
**Status:** Completed

**Deliverable:** Tests for project API routes

---

### Step 6.7: Integration Tests for Article API
**Status:** Completed

**Deliverable:** Tests for article API routes (53 API tests)

---

### Step 6.8: Coverage Report and Gap Filling
**Status:** In Progress

**Current Coverage:** 20.15% (target: 80%)

**Progress:**
- 142 tests passing
- Coverage improved from 4.24% → 20.15%

**Remaining Work:**
- [ ] Add tests for `src/app/(public)` pages
- [ ] Add tests for middleware
- [ ] Add tests for remaining components
- [ ] Run final coverage report

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