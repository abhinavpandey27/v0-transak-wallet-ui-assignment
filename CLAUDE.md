# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting

## Project Architecture

### Framework & Technology Stack
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** with Radix UI components
- **Shadcn/ui** component library
- **next-themes** for theme management
- **React Hook Form** with Zod validation
- **Chart.js** and **Recharts** for data visualization

### Project Structure

\`\`\`
app/                    # Next.js App Router pages
├── layout.tsx         # Root layout with font configuration
├── page.tsx           # Home page (renders AuthFlow)
└── globals.css        # Global styles

components/
├── auth/              # Authentication components
├── flows/             # Multi-step user flows (deposit, withdrawal)
├── screens/           # Full-screen components
├── shared/            # Reusable components
├── theme/             # Theme and settings components
└── ui/                # Shadcn/ui base components

contexts/              # React contexts
├── AuthContext.tsx    # Authentication state management
└── SimpleThemeContext.tsx

data/                  # Mock data and configuration
├── fonts.ts           # Font configuration
└── mockData.ts        # Sample data for demo

types/                 # TypeScript type definitions
lib/                   # Utilities and helpers
\`\`\`

### Key Architectural Patterns

#### Authentication Flow
- Uses `AuthContext` with demo OTP (123456) for authentication
- Three-step flow: login → OTP verification → dashboard
- Persistent authentication state using localStorage

#### Multi-Screen Flows
- **DepositFlow** and **WithdrawalFlow** manage multi-step processes
- Each flow maintains internal state and screen navigation
- Screens are componentized (e.g., `EnterAmountScreen`, `BankDetailsScreen`)

#### Theme System
- Multi-font support with 7 Google Fonts configured in layout
- Dark/light theme toggle using next-themes
- Customizable theme settings with user preferences
- Theme variables stored as CSS custom properties

#### Component Structure
- UI components follow Shadcn/ui patterns with Radix UI primitives
- Shared components in `/shared` for reusable business logic
- Screen components for full-page views
- Flow components orchestrate multi-step processes

#### Data Management
- Mock data in `data/mockData.ts` for currencies, tokens, transactions
- TypeScript interfaces in `types/index.ts` define data contracts
- No external API dependencies - fully demo mode

### Development Guidelines

#### Code Style (from .cursor/rules/vercel-15.mdc)
- Use React Server Components where possible, minimize 'use client'
- Prefer `useActionState` over deprecated `useFormState`
- Use async versions of Next.js APIs (cookies(), headers(), etc.)
- Handle async params in layouts/pages: `const params = await props.params`
- Functional and declarative programming patterns
- Descriptive naming with auxiliary verbs (isLoading, hasError)
- Event handlers prefixed with "handle" (handleClick, handleSubmit)

#### Component Architecture
- Components structured: exports, subcomponents, helpers, types
- Error boundaries implemented for robust error handling
- Suspense boundaries for async operations
- Proper TypeScript interfaces over types
- Named exports preferred for components

### Responsive Design
- Mobile-first approach with responsive breakpoints
- Sheet components for mobile navigation
- Resizable sidebar for desktop layout
- Adaptive component rendering based on screen size
