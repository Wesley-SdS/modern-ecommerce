# Development Commands

## Build & Test
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run lint` - Run ESLint
- `npm run test` - Run all Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm test -- --testNamePattern="test name"` - Run single test by name

## Database
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

# Code Style Guidelines

## Imports
- Use absolute imports with `@/` alias for internal files
- Group imports: React/Next.js first, then third-party libs, then internal modules
- Always use TypeScript import/export syntax

## Types & Formatting  
- All components must use TypeScript with proper typing
- Use Zod schemas for type validation (see lib/types.ts)
- Prices stored in cents as integers (priceCents)
- Use class-variance-authority (CVA) for component variants
- Follow existing naming conventions: PascalCase for components, camelCase for functions

## Component Architecture
- Server components in app/, client components marked with "use client"
- UI components in components/ui/ using shadcn/ui patterns
- Business logic in server/services/ with dependency injection
- Use zustand for state management (store/ directory)
- Internationalization with next-intl

## Error Handling
- Use try/catch blocks in service layer
- Return consistent API response format (lib/api-response.ts)
- Validate inputs with Zod schemas before processing
- Handle database errors gracefully in repositories