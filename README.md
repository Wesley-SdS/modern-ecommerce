# E-commerce Platform

A modern, production-ready e-commerce platform built with Next.js 15, TypeScript, Prisma, and PostgreSQL. Features a complete admin panel, internationalization (Portuguese, Spanish, English), Stripe payment integration, and comprehensive inventory and financial management.

## Features

### Public Features
- 🛍️ Product browsing with search and filters
- 🌐 Multi-language support (Portuguese, Spanish, English)
- 🛒 Shopping cart with real-time updates
- 💳 Secure checkout with Stripe
- 📱 Fully responsive design

### Admin Features
- 📊 Dashboard with sales analytics
- 📦 Product management (CRUD)
- 📈 Inventory tracking and adjustments
- 💰 Financial management (accounts receivable/payable)
- 🎨 Banner management
- 👥 User management with role-based access
- 📉 Cash flow visualization

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Internationalization**: next-intl
- **Testing**: Jest, React Testing Library
- **Containerization**: Docker, Docker Compose

## Architecture

The project follows Clean Code and SOLID principles with a layered architecture:

\`\`\`
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── admin/             # Admin-specific components
│   ├── shared/            # Shared components
│   └── ui/                # shadcn/ui components
├── server/                # Backend logic
│   ├── repositories/      # Data access layer
│   ├── services/          # Business logic layer
│   └── validators/        # Input validation with Zod
├── lib/                   # Utilities and configurations
├── prisma/                # Database schema and migrations
├── messages/              # i18n translation files
└── __tests__/             # Test files
\`\`\`

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ecommerce-platform
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your configuration:
\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
\`\`\`

4. Run database migrations:
\`\`\`bash
npm run db:migrate
\`\`\`

5. Seed the database:
\`\`\`bash
npm run db:seed
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

### Default Admin Credentials

- Email: `admin@ecommerce.com`
- Password: `admin123`

## Docker Setup

### Development with Docker Compose

1. Start all services:
\`\`\`bash
npm run docker:up
\`\`\`

This will start:
- PostgreSQL database (port 5432)
- Next.js application (port 3000)
- pgAdmin (port 5050)

2. View logs:
\`\`\`bash
npm run docker:logs
\`\`\`

3. Stop services:
\`\`\`bash
npm run docker:down
\`\`\`

### Production Docker Build

\`\`\`bash
docker build -t ecommerce-app .
docker run -p 3000:3000 ecommerce-app
\`\`\`

## Database Management

\`\`\`bash
# Generate Prisma Client
npm run db:generate

# Create a migration
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:prod

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Reset database
npm run db:reset
\`\`\`

## Testing

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
\`\`\`

## API Endpoints

### Public Endpoints

- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/checkout` - Create checkout session

### Admin Endpoints (Authentication Required)

**Products**
- `POST /api/v1/admin/products` - Create product
- `PUT /api/v1/admin/products/:id` - Update product
- `DELETE /api/v1/admin/products/:id` - Delete product
- `POST /api/v1/admin/products/:id/stock` - Adjust stock

**Finance**
- `GET /api/v1/admin/finance/accounts-receivable` - List receivables
- `POST /api/v1/admin/finance/accounts-receivable` - Create receivable
- `GET /api/v1/admin/finance/accounts-payable` - List payables
- `POST /api/v1/admin/finance/accounts-payable` - Create payable
- `POST /api/v1/admin/finance/:id/mark-paid` - Mark as paid

**Banners**
- `GET /api/v1/admin/banners` - List banners
- `POST /api/v1/admin/banners` - Create banner
- `PUT /api/v1/admin/banners/:id` - Update banner
- `DELETE /api/v1/admin/banners/:id` - Delete banner

**Users**
- `GET /api/v1/admin/users` - List users
- `POST /api/v1/admin/users` - Create user
- `PUT /api/v1/admin/users/:id` - Update user role
- `DELETE /api/v1/admin/users/:id` - Delete user

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Start production server:
\`\`\`bash
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
