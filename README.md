<div align="center">

# 🛍️ Modern E-commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**A production-ready, full-stack e-commerce platform with advanced admin dashboard**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API](#-api-reference)

</div>

---

## ✨ Features

### 🛒 **Customer Experience**

<table>
<tr>
<td width="50%">

#### Shopping Features
- 🔍 **Advanced Product Search** - Real-time search with filters
- 📱 **Responsive Design** - Optimized for all devices
- 🛒 **Smart Shopping Cart** - Persistent cart with real-time updates
- 💳 **Secure Payments** - Stripe integration with webhooks
- 🌐 **Multi-language** - Support for PT-BR, EN, ES
- ⚡ **Fast Performance** - Server-side rendering & caching

</td>
<td width="50%">

#### User Interface
- 🎨 **Modern UI** - Built with shadcn/ui components
- 🌓 **Dark Mode** - Automatic theme switching
- ♿ **Accessible** - WCAG 2.1 compliant
- 🔔 **Real-time Notifications** - Toast notifications
- 📦 **Product Gallery** - Image carousel with zoom
- ⭐ **Product Reviews** - Rating and feedback system

</td>
</tr>
</table>

### 👨‍💼 **Admin Dashboard**

<table>
<tr>
<td width="50%">

#### Management Tools
- 📊 **Analytics Dashboard** - Sales, revenue & KPIs
- 📦 **Product Management** - Full CRUD operations
- 📈 **Inventory Tracking** - Stock levels & movements
- 💰 **Financial Control** - Accounts receivable/payable
- 🎨 **Banner Management** - Marketing campaigns
- 👥 **User Management** - Role-based access control

</td>
<td width="50%">

#### Business Intelligence
- 💹 **Cash Flow Charts** - Visual financial reports
- 📉 **Sales Analytics** - Revenue trends & insights
- 📋 **Order Management** - Track and process orders
- 🔐 **Security** - Protected admin routes
- 📱 **Mobile Admin** - Manage on-the-go
- 🔄 **Real-time Updates** - Live data synchronization

</td>
</tr>
</table>

---

## 🚀 Tech Stack

### **Core Technologies**

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15 (App Router) • React 19 • TypeScript 5 |
| **Styling** | Tailwind CSS v4 • shadcn/ui • Radix UI |
| **Database** | PostgreSQL 16 • Prisma ORM 6 |
| **Authentication** | NextAuth.js • JWT • Bcrypt |
| **Payments** | Stripe • Webhooks • Checkout Session |
| **State Management** | Zustand • React Query • Server Actions |
| **Internationalization** | next-intl • 3 languages (PT, EN, ES) |
| **Testing** | Jest • React Testing Library • Playwright |
| **DevOps** | Docker • Docker Compose • GitHub Actions |
| **Code Quality** | ESLint • Prettier • Husky • Commitlint |

### **Architecture Highlights**

```
┌─────────────────────────────────────────────────────────────┐
│                     CLEAN ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer    →  Next.js Pages & Components        │
│  Business Logic Layer  →  Services & Use Cases              │
│  Data Access Layer     →  Repositories & Prisma             │
│  Infrastructure Layer  →  External APIs & Services          │
└─────────────────────────────────────────────────────────────┘
```

**Design Patterns:**
- 🏗️ Repository Pattern for data access
- 🎯 Service Layer for business logic
- 🔄 Dependency Injection
- ✅ Input Validation with Zod schemas
- 🛡️ Error Handling with custom exceptions

---

## 📁 Project Structure

```
modern-ecommerce/
├── 📱 app/                      # Next.js App Router
│   ├── [locale]/               # Internationalized routes
│   │   ├── (main)/            # Customer-facing pages
│   │   └── admin/             # Admin dashboard
│   └── api/                    # API routes
│       └── v1/                # Versioned API endpoints
├── 🎨 components/              # React components
│   ├── admin/                 # Admin-specific components
│   ├── shared/                # Reusable components
│   └── ui/                    # shadcn/ui components (60+)
├── 🔧 server/                  # Backend logic (Clean Architecture)
│   ├── repositories/          # Data access layer
│   ├── services/              # Business logic layer
│   └── validators/            # Zod validation schemas
├── 🗄️ prisma/                  # Database management
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
├── 🛠️ lib/                     # Utilities & configurations
│   ├── auth.ts                # Authentication setup
│   ├── prisma.ts              # Database client
│   └── utils.ts               # Helper functions
├── 🌐 messages/                # i18n translation files
│   ├── en.json                # English
│   ├── pt.json                # Portuguese
│   └── es.json                # Spanish
├── 🏪 store/                   # Zustand state stores
│   ├── auth-store.ts          # Authentication state
│   └── cart-store.ts          # Shopping cart state
├── 🪝 hooks/                   # Custom React hooks
├── 🧪 __tests__/               # Unit & integration tests
└── 🎭 tests/                   # E2E tests (Playwright)
```

---

## 🏃 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- ✅ **pnpm** (recommended) or npm ([Install pnpm](https://pnpm.io/installation))
- ✅ **PostgreSQL** 16+ ([Download](https://www.postgresql.org/download/))
- ✅ **Git** ([Download](https://git-scm.com/))

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Wesley-SdS/modern-ecommerce.git
cd modern-ecommerce
```

**2. Install dependencies**

```bash
pnpm install
# or
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# Stripe (Get from https://stripe.com/docs/keys)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Optional
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**4. Set up the database**

```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

**5. Start the development server**

```bash
pnpm dev
```

🎉 **Open [http://localhost:3000](http://localhost:3000)** in your browser!

### 🔐 Default Admin Credentials

```
Email:    admin@ecommerce.com
Password: admin123
```

> ⚠️ **Important:** Change these credentials in production!

---

## 🐳 Docker Setup

### Development with Docker Compose

Run the entire stack (app + database + pgAdmin) with one command:

```bash
# Start all services
pnpm docker:up

# View logs
pnpm docker:logs

# Stop services
pnpm docker:down
```

**Services:**
- 🌐 **App**: http://localhost:3000
- 🗄️ **PostgreSQL**: localhost:5432
- 🔍 **pgAdmin**: http://localhost:5050

### Production Docker Build

```bash
# Build image
docker build -t modern-ecommerce .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  modern-ecommerce
```

---

## 🗄️ Database Management

```bash
# Generate Prisma Client
pnpm db:generate

# Create and apply migrations
pnpm db:migrate

# Deploy migrations (production)
pnpm db:migrate:prod

# Seed database with sample data
pnpm db:seed

# Open Prisma Studio (Database GUI)
pnpm db:studio

# Reset database (⚠️ deletes all data)
pnpm db:reset

# Push schema without migrations (dev only)
pnpm db:push
```

---

## 🧪 Testing

### Unit & Integration Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### E2E Tests (Playwright)

```bash
# Install browsers (first time)
pnpm test:e2e:install

# Run E2E tests
pnpm test:e2e

# Run with UI
pnpm test:e2e:headed

# View report
pnpm test:e2e:report
```

---

## 📚 API Reference

### Public Endpoints

#### Products

```http
GET    /api/v1/products           # List all products (paginated)
GET    /api/v1/products/:id       # Get product details
```

#### Banners

```http
GET    /api/v1/banners            # Get active banners
```

#### Authentication

```http
POST   /api/v1/auth/register      # Register new user
```

#### Checkout

```http
POST   /api/v1/checkout           # Create Stripe checkout session
```

#### Webhooks

```http
POST   /api/v1/webhooks/stripe    # Stripe webhook handler
```

### Admin Endpoints (🔐 Authentication Required)

#### Products Management

```http
POST   /api/v1/admin/products              # Create product
PUT    /api/v1/admin/products/:id          # Update product
DELETE /api/v1/admin/products/:id          # Delete product
POST   /api/v1/admin/products/:id/stock    # Adjust stock
```

#### Inventory Management

```http
GET    /api/v1/admin/inventory             # Get inventory data
POST   /api/v1/admin/inventory             # Create movement
```

#### Financial Management

```http
GET    /api/v1/admin/finance/accounts-receivable    # List receivables
POST   /api/v1/admin/finance/accounts-receivable    # Create receivable
GET    /api/v1/admin/finance/accounts-payable       # List payables
POST   /api/v1/admin/finance/accounts-payable       # Create payable
POST   /api/v1/admin/finance/:id/mark-paid          # Mark as paid
```

#### Banner Management

```http
GET    /api/v1/admin/banners              # List banners
POST   /api/v1/admin/banners              # Create banner
PUT    /api/v1/admin/banners/:id          # Update banner
DELETE /api/v1/admin/banners/:id          # Delete banner
POST   /api/v1/admin/banners/:id/toggle   # Toggle visibility
```

#### User Management

```http
GET    /api/v1/admin/users                # List users
POST   /api/v1/admin/users                # Create user
PUT    /api/v1/admin/users/:id            # Update user
DELETE /api/v1/admin/users/:id            # Delete user
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Wesley-SdS/modern-ecommerce)

**Steps:**
1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy! 🚀

**Environment Variables Required:**
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Deploy to Other Platforms

- **Railway**: [Guide](https://docs.railway.app/deploy/deployments)
- **Render**: [Guide](https://render.com/docs/deploy-nextjs-app)
- **AWS**: Use Docker image with ECS/Fargate
- **DigitalOcean**: App Platform or Droplet with Docker

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | Check TypeScript types |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm docker:up` | Start Docker services |
| `pnpm analyze` | Analyze bundle size |

---

## 🎯 Roadmap

- [ ] **Product Reviews & Ratings**
- [ ] **Wishlist Functionality**
- [ ] **Email Notifications** (SendGrid/Resend)
- [ ] **Advanced Search** (Algolia/MeiliSearch)
- [ ] **Product Recommendations** (AI-powered)
- [ ] **Order Tracking** (Real-time updates)
- [ ] **Admin Analytics** (Advanced reports)
- [ ] **Multi-vendor Support**
- [ ] **PWA Support** (Offline mode)
- [ ] **Social Authentication** (Google, Facebook)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes (follow [Conventional Commits](https://www.conventionalcommits.org/))
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Wesley Silva**

- GitHub: [@Wesley-SdS](https://github.com/Wesley-SdS)
- Repository: [modern-ecommerce](https://github.com/Wesley-SdS/modern-ecommerce)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Stripe](https://stripe.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

## 📞 Support

If you have any questions or need help, please:

- 📝 Open an [Issue](https://github.com/Wesley-SdS/modern-ecommerce/issues)
- 💬 Start a [Discussion](https://github.com/Wesley-SdS/modern-ecommerce/discussions)
- ⭐ Star the repository if you find it helpful!

---

<div align="center">

**Made with ❤️ using Next.js 15 and React 19**

⭐ Star this repo if you find it useful!

[Report Bug](https://github.com/Wesley-SdS/modern-ecommerce/issues) • [Request Feature](https://github.com/Wesley-SdS/modern-ecommerce/issues)

</div>
