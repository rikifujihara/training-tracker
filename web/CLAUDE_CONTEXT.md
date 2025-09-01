# Training Tracker Web - Claude Code Context

## Project Overview

This is a Next.js web application evolving from a Supabase starter template into an all-in-one operations app specifically for rent-paying personal trainers at commercial gyms. The project is in active development with authentication and user management features already implemented.

## Product Vision

### Target Problem

Unlike existing PT software that focuses primarily on workout programming, this app addresses the real pain point: PTs spend most of their time on sales and admin, not training. The app streamlines lead management, CRM, client onboarding, and billing - the activities that actually consume 90% of a PT's administrative time.

### Target Audience

Independent personal trainers who rent space at commercial gym chains (not gym employees or online influencers). These are ordinary PTs serving middle-aged clients who need in-person guidance. The target market has low tech-savviness and needs brain-dead simple solutions. They currently rely on Google Sheets and phone notes, spending hours weekly manually calling leads and managing basic admin tasks.

### Core Solution

PTs get leads in bulk from their gyms but waste enormous time manually dialing numbers and tracking interactions. Current PT software focuses on workout creation (which most PTs improvise anyway) while ignoring the sales process that generates 90% of their clients. This app provides:

- Bulk lead import and in-app calling
- Streamlined client onboarding with digital forms/contracts
- Integrated billing eliminating administrative bottlenecks that prevent PTs from scaling

### Key Features

- Lead management with bulk import and in-app dialing
- CRM for tracking client interactions and booking consultations (the critical sales conversion point)
- Digital client onboarding (contracts, payment forms, T&Cs)
- Flexible billing (one-off sessions, packages, subscriptions)
- Basic workout/program tracking and session scheduling
- Simple, mobile-first interface for non-technical users

## Package Management

- **Package Manager**: pnpm
- **Commands**:
  - `pnpm dev` - Start development server with turbopack
  - `pnpm build` - Build for production
  - `pnpm start` - Start production server
  - `pnpm lint` - Run ESLint

## Technology Stack

### Frontend

- **Framework**: Next.js (latest version with App Router)
- **React**: v19.0.0
- **TypeScript**: v5
- **Styling**: Tailwind CSS v3.4.1 with tailwindcss-animate
- **UI Components**:
  - shadcn/ui components (Radix UI based)
  - Custom components for auth, forms, tutorials
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

### Backend & Database

- **Database**: PostgreSQL via Prisma ORM v6.15.0
- **Authentication**: Supabase Auth with SSR support
- **API**: Next.js API routes and Server Actions
- **Deployment**: Vercel for web platform
- **Mobile**: React Native with Expo (future development)

### Key Dependencies

- `@supabase/supabase-js` and `@supabase/ssr` for authentication
- `@prisma/client` for database operations
- `class-variance-authority` and `clsx` for component styling
- `tailwind-merge` for Tailwind class merging

## Project Structure

### App Directory (Next.js App Router)

- `app/page.tsx` - Home page with hero and tutorial steps
- `app/layout.tsx` - Root layout
- `app/globals.css` - Global styles
- `app/protected/` - Protected routes requiring authentication
- `app/auth/` - Authentication pages (login, signup, forgot password, etc.)

### Components

- `components/auth-*` - Authentication related components
- `components/ui/` - shadcn/ui components (button, input, card, etc.)
- `components/tutorial/` - Tutorial and onboarding components
- Various form components and utilities

### Libraries

- `lib/supabase/` - Supabase client configuration (client, server, middleware)
- `lib/utils.ts` - Utility functions

### Database

- `prisma/schema.prisma` - Database schema (currently minimal setup)
- Configured for PostgreSQL with custom output directory

## Authentication & Middleware

- Supabase-based authentication with cookie management
- Protected routes middleware that redirects unauthenticated users to login
- Environment variable validation for Supabase configuration

## Development Notes

- Project appears to be transitioning from the Next.js + Supabase starter template
- Recent commits suggest work on role selection and invitations features
- Uses modern Next.js features (App Router, Server Components, Server Actions)
- Configured with ESLint and TypeScript for code quality

## Environment Setup

- Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Database connection via `DATABASE_URL` environment variable

## Business Context

### Business Model

- **Freemium Model**: Limited client capacity on free tier, transitioning to paid subscriptions
- **Target Timeline**: MVP beta in 3 months, iterative improvement based on real PT feedback
- **Go-to-Market**: Initial distribution through co-founder's PT network for testimonials and word-of-mouth growth within gym communities

### Market Position

- **Competing Against**: Free solutions (Google Sheets) and training-focused apps that miss the sales/admin pain point
- **Similar Concept**: Gym management software like GymMaster, but tailored for individual PT operations rather than gym facilities
- **Key Differentiator**: Focus on sales and administrative workflows rather than workout programming

### Design Principles

- **Simplicity First**: Brain-dead simple solutions for low tech-savviness users
- **Mobile-First**: Primary interface optimized for mobile usage
- **Reliability**: Prioritizing simplicity and reliability over advanced features

## Development Priorities

1. Lead management and CRM functionality
2. Client onboarding workflows
3. Billing and payment integration
4. Basic workout/session tracking
5. Mobile app development (React Native/Expo)

## Areas for Development Context

<!-- Add your specific context, requirements, and notes here -->
