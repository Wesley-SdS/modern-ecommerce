# Modern E-commerce Setup Guide

This guide will help you set up and run the modern e-commerce platform locally and in production.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL 14+
- Git
- Docker (optional)

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/your-username/modern-ecommerce.git
cd modern-ecommerce
npm install
```

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Configure your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe (optional for testing)
STRIPE_PUBLIC_KEY="pk_test_your-stripe-public-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Email (optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE ecommerce_db;
```

Run database migrations:

```bash
npm run db:generate
npm run db:migrate
```

Seed the database with sample data:

```bash
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Docker Development

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Building Docker Image

```bash
docker build -t modern-ecommerce .
docker run -p 3000:3000 modern-ecommerce
```

## Project Structure

```
modern-ecommerce/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── shared/           # Shared components
│   ├── admin/            # Admin components
│   └── providers/        # Context providers
├── server/               # Backend logic
│   ├── services/         # Business logic
│   ├── repositories/     # Data access
│   ├── interfaces/       # TypeScript interfaces
│   └── middleware/       # Error handling
├── lib/                  # Utility functions
├── store/               # State management
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── prisma/              # Database schema and migrations
├── __tests__/           # Test files
├── docs/                # Documentation
└── public/              # Static assets
```

## Available Scripts

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run typecheck        # Run TypeScript type checking
```

### Database
```bash
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:migrate:prod  # Deploy migrations (production)
npm run db:push          # Push schema to database
npm run db:reset         # Reset database
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio
```

### Testing
```bash
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run E2E tests
npm run test:e2e:headed  # Run E2E tests with UI
```

### Docker
```bash
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
npm run docker:logs      # View Docker logs
```

## Coding Standards

### Code Quality Tools

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **CommitLint**: Commit message linting
- **TypeScript**: Static type checking

### Pre-commit Hooks

The project includes pre-commit hooks that run:
- ESLint
- TypeScript type checking
- Unit tests
- Code formatting

### Code Style

Follow the established patterns:
- Use TypeScript strict mode
- Components follow Single Responsibility Principle
- Services implement dependency injection
- Use Zod for validation
- Write tests for all new features

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities:

- **Users**: Authentication and roles
- **Products**: Product catalog with categories
- **Orders**: Customer orders and items
- **Cart**: Shopping cart functionality
- **Banners**: Marketing banners
- **FinancialRecords**: Financial tracking

## Internationalization

The application supports multiple languages using next-intl:

- Supported locales: `en`, `es`, `pt`
- Translation files: `messages/[locale].json`
- Dynamic locale routing

## Authentication

Uses NextAuth.js for authentication:

- Email/password login
- OAuth providers (Google, GitHub)
- Role-based access control
- Session management

## Payment Integration

Stripe integration for payments:

- Checkout sessions
- Payment intents
- Webhook handling
- Subscription support

## Testing Strategy

### Unit Tests
- Components: `__tests__/components/`
- Utilities: `__tests__/lib/`
- Store: `__tests__/store/`
- Services: `__tests__/server/services/`

### Integration Tests
- API endpoints: `__tests__/integration/`
- Database operations: `__tests__/server/repositories/`

### E2E Tests
- User flows: `tests/e2e/`
- Cross-browser testing with Playwright

## Performance Optimization

### Image Optimization
- Next.js Image component
- WebP/AVIF formats
- Responsive images
- Lazy loading

### Code Splitting
- Automatic with Next.js
- Dynamic imports for large components
- Route-based splitting

### Caching
- Static asset caching
- API response caching
- Database query optimization

## Security

### Headers
- Security headers configured
- CSRF protection
- Rate limiting

### Validation
- Input validation with Zod
- SQL injection prevention
- XSS protection

### Authentication
- Secure session management
- Role-based permissions
- API rate limiting

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Docker

```bash
# Build image
docker build -t modern-ecommerce .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  modern-ecommerce
```

### Manual Deployment

```bash
# Build application
npm run build

# Start production server
npm start
```

## Monitoring

### Health Checks

- `/api/health` endpoint
- Database connectivity
- Memory usage
- External service status

### Analytics

- Vercel Analytics
- Custom event tracking
- Error monitoring

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify PostgreSQL is running
   - Check network connectivity

2. **Build Errors**
   - Run `npm run typecheck` for type errors
   - Check `npm run lint` for linting issues
   - Verify environment variables

3. **Test Failures**
   - Ensure database is seeded
   - Check test environment variables
   - Run `npm run db:reset` if needed

### Getting Help

- Check the [API documentation](./API.md)
- Review GitHub issues
- Contact support team

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Commit Message Format

Use conventional commits:

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Documentation: [API docs](./API.md)
- Issues: [GitHub Issues](https://github.com/your-username/modern-ecommerce/issues)
- Email: support@your-domain.com