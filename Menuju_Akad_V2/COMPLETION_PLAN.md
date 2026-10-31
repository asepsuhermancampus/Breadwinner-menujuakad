# RENCANA PELENGKAPAN MENAJU_AKAD_V2 - FULLSTACK V2

## Phase 0: Persiapan & Planning (Hari 1)

- [ ] Buat TODO tracking terstruktur
- [ ] Audit schema Prisma V1 untuk referensi model lengkap
- [ ] Setup branch kerja terpisah

## Phase 1: Database Layer - Schema & Migration (Hari 2-4)

### 1.1 Lengkapi Schema Prisma

- [ ] Workspace, Event, Membership, Role
- [ ] Invitation, Guest, RSVP, InvitationTemplate
- [ ] Planner: Task, CalendarEvent, Rundown, Checklist, ChecklistItem
- [ ] Budget: Category, Expense, VendorPayment, BudgetSummary
- [ ] Vendor/Marketplace: Vendor, Service, Request, Quote, Contract
- [ ] Catering: Menu, Package, Order, DietaryRequirement
- [ ] Payments: Order, Transaction, KlikQrisConfig, WebhookLog
- [ ] Subscriptions: Plan, Subscription, Invoice, Usage
- [ ] Reviews: Review, ReviewAdmin, ReviewInvitation
- [ ] KUA: Document, Template, GeneratedDocument
- [ ] WeddingKit: Asset, Theme, Customization
- [ ] Notifications: Notification, NotificationPreference, Channel
- [ ] Audit/Activity: AuditLog, ActivityFeed

### 1.2 Migrasi & Verifikasi

- [ ] Generate Prisma Client
- [ ] Run prisma migrate dev --name init
- [ ] Verify schema di Neon console
- [ ] Seed data development

## Phase 2: Repository Layer (Hari 5-8)

### 2.1 Base Repository Pattern

- [ ] Abstract base class dengan CRUD + pagination + filtering
- [ ] Transaction helper
- [ ] Soft delete pattern

### 2.2 Domain Repositories

- [ ] WorkspaceRepository
- [ ] EventRepository
- [ ] InvitationRepository
- [ ] GuestRepository
- [ ] RSVPRepository
- [ ] TaskRepository
- [ ] CalendarRepository
- [ ] BudgetRepository
- [ ] VendorRepository
- [ ] PaymentRepository
- [ ] SubscriptionRepository
- [ ] ReviewRepository
- [ ] KUARepository
- [ ] NotificationRepository

## Phase 3: Server Actions & API Routes (Hari 9-14)

### 3.1 Auth Hardening

- [ ] Email verification flow (Resend/SendGrid)
- [ ] Password reset dengan token expiry
- [ ] 2FA/TOTP untuk superadmin
- [ ] Session management (refresh, device tracking, concurrent limits)

### 3.2 Feature Server Actions

- [ ] Workspace CRUD + membership management
- [ ] Event CRUD + settings
- [ ] Invitation builder + send + tracking
- [ ] Guest import/export + RSVP management
- [ ] Planner: tasks, calendar, rundown, checklists
- [ ] Budget: categories, expenses, vendor payments
- [ ] Marketplace: vendor catalog, requests, quotes
- [ ] Payments: KlikQRIS integration, webhooks
- [ ] Subscriptions: plans, upgrades, billing
- [ ] Reviews: submission, moderation, display
- [ ] KUA: document generation, templates
- [ ] Notifications: preferences, channels, delivery

## Phase 4: UI Integration - Replace Mocks (Hari 15-20)

- [ ] Auth pages: login, register, verify, reset
- [ ] Account pages: profile, security, plans, devices
- [ ] Onboarding: profile, event, partner pairing
- [ ] Dashboard: workspace switcher, event context
- [ ] Planner: calendar view, task board, rundown, checklists
- [ ] Invitations: studio, preview, guest list, RSVP
- [ ] Budget: overview, categories, expenses, reports
- [ ] Marketplace: browse, request, compare quotes
- [ ] Settings: notifications, privacy, integrations

## Phase 5: Testing & Quality (Hari 21-24)

- [ ] Unit tests untuk semua repositories
- [ ] Integration tests untuk server actions
- [ ] E2E tests untuk critical paths
- [ ] Architecture check pass
- [ ] Typecheck pass
- [ ] Build pass

## Phase 6: CI/CD & Production (Hari 25-28)

- [ ] GitHub Actions workflow
- [ ] Staging environment (Vercel preview)
- [ ] Production deployment config
- [ ] Environment variables management
- [ ] Database backup strategy
- [ ] Monitoring: Sentry, logging
- [ ] Health checks

## Phase 7: Polish & Accessibility (Hari 29-35)

- [ ] WCAG 2.1 AA audit & fixes
- [ ] Performance optimization
- [ ] Offline support (service worker)
- [ ] i18n: Indonesian/English
- [ ] Documentation update

---

## Estimasi Total: 35-40 hari kerja (~7-8 minggu)

## Prioritas Eksekusi (MVP First):

1. Schema + Migration (Phase 1)
2. Core Repositories: Workspace, Event, Invitation, Guest (Phase 2 partial)
3. Auth hardening + core server actions (Phase 3 partial)
4. UI integration untuk core flows (Phase 4 partial)
5. CI/CD + Deploy staging (Phase 6)
6. Sisanya iteratif

---

## Status Tracking:

- Created: 2026-10-31T05:40:00.000Z
- Last Updated: 2026-10-31T05:40:00.000Z
- Current Phase: 0
- Completed Tasks: 0
