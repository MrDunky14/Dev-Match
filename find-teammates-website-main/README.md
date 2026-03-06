# CollabNest – AI-Powered Developer & Resource Intelligence Hub

![CollabNest Banner](https://via.placeholder.com/1200x400/2563eb/ffffff?text=CollabNest+-+Find+Your+Perfect+Dev+Team)

## 🚀 Overview

**CollabNest** is a production-ready, full-stack web application designed to help college developers find perfect teammates, learn new skills, and build winning hackathon projects. Powered by AI algorithms and built with modern web technologies.

### 🎯 Key Features

- **AI-Powered Teammate Matching**: Swipe-style interface with intelligent compatibility scoring (40% skill overlap, 30% complementary skills, 20% interests, 10% availability)
- **Skill Gap Analysis**: Compare your skills against target roles and receive personalized learning paths
- **Project Idea Generator**: AI-generated hackathon-ready project ideas with complete tech stacks
- **Curated Resource Hub**: Community-driven learning resources with AI recommendations and upvoting
- **Analytics Dashboard**: Comprehensive charts and graphs tracking matches, progress, and skill distribution
- **Profile Management**: Skill-based profiles with tags, interests, and experience levels

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **React Router v7** - Client-side routing
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful analytics charts
- **Lucide React** - Icon library

### Backend (Ready for Integration)
This frontend application is ready to be connected to:
- **Node.js + Express** - RESTful API
- **PostgreSQL + Prisma** - Database and ORM
- **JWT** - Authentication
- **OpenAI API** - AI features (currently using mock data)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ or pnpm
- Modern web browser

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/collabnest.git
   cd collabnest
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
collabnest/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # Base UI components (Button, Card, Input, etc.)
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.tsx  # Authentication state management
│   │   ├── lib/                 # Utilities and business logic
│   │   │   ├── types.ts         # TypeScript type definitions
│   │   │   ├── mockData.ts      # Mock data for demo
│   │   │   ├── matchingAlgorithm.ts  # Compatibility scoring
│   │   │   ├── aiService.ts     # AI tools logic
│   │   │   └── utils.ts         # Helper functions
│   │   ├── pages/               # Application pages
│   │   │   ├── Landing.tsx      # Marketing landing page
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Signup.tsx       # Registration page
│   │   │   ├── Dashboard.tsx    # Analytics dashboard
│   │   │   ├── Profile.tsx      # User profile management
│   │   │   ├── Match.tsx        # Teammate matching (swipe UI)
│   │   │   ├── Resources.tsx    # Resource hub
│   │   │   └── AITools.tsx      # AI tools (Skill Gap, Project Ideas)
│   │   ├── App.tsx              # Root component
│   │   └── routes.ts            # Route configuration
│   └── styles/                  # Global styles
│       ├── fonts.css
│       ├── tailwind.css
│       ├── theme.css
│       └── index.css
├── package.json
└── README.md
```

---

## 🎨 Features in Detail

### 1. Authentication System
- JWT-based authentication (ready for backend)
- Secure login/signup flows
- Protected routes
- Persistent sessions with localStorage

### 2. AI Teammate Matching
**Algorithm Breakdown:**
```typescript
Compatibility Score = 
  40% × (Skill Overlap %) +
  30% × (Complementary Skills Score) +
  20% × (Interest Similarity %) +
  10% × (Availability Match)
```

- Swipe right to save, left to pass
- Real-time compatibility calculations
- Match statistics and saved matches sidebar

### 3. Analytics Dashboard
- **Weekly Activity Chart**: Area chart showing matches and resources over time
- **Skill Distribution**: Bar chart of popular skills
- **Key Metrics**: Total matches, avg compatibility, resources saved, skills learned
- **Activity Feed**: Recent actions and updates

### 4. Skill Gap Analysis
- Select target role (Frontend, Backend, Full Stack, AI/ML, Mobile, DevOps)
- Visual progress bar showing skill completion percentage
- Missing skills highlighted with recommendations
- Step-by-step learning path generation

### 5. Project Idea Generator
- AI-powered project suggestions based on your skills
- Optional hackathon theme input
- Complete breakdown:
  - Problem statement
  - Key features
  - Recommended tech stack
  - MVP scope

### 6. Resource Hub
- Filter by category (GitHub, YouTube, Docs, Course, Blog)
- Search by title or tags
- Upvote system
- Sort by popularity or recency
- AI recommendations based on user skills

---

## 🔧 Configuration

### Environment Variables (for backend integration)

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/collabnest"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# OpenAI API (for AI features)
OPENAI_API_KEY="sk-your-openai-api-key"

# Server
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

### Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  password     String
  college      String
  skills       String[]
  interests    String[]
  experience   String
  bio          String?
  availability String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  resources    Resource[]
  matches      Match[]    @relation("UserMatches")
}

model Resource {
  id          String   @id @default(uuid())
  title       String
  link        String
  category    String
  tags        String[]
  upvotes     Int      @default(0)
  description String?
  createdAt   DateTime @default(now())
  
  createdBy   String
  user        User     @relation(fields: [createdBy], references: [id])
}

model Match {
  id                  String   @id @default(uuid())
  userId              String
  matchedUserId       String
  compatibilityScore  Int
  explanation         String
  createdAt           DateTime @default(now())
  
  user                User     @relation("UserMatches", fields: [userId], references: [id])
}
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**
   ```bash
   pnpm build
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Deploy to Netlify**
   ```bash
   netlify deploy --prod
   ```

### Backend Deployment (Railway/Render/Heroku)

1. Set up your PostgreSQL database
2. Configure environment variables
3. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Deploy your Node.js/Express backend

---

## 🎯 API Endpoints (Backend Reference)

### Authentication
```
POST /api/auth/signup      - Register new user
POST /api/auth/login       - Login user
GET  /api/auth/me          - Get current user
```

### Users
```
GET    /api/users/:id      - Get user profile
PUT    /api/users/:id      - Update user profile
GET    /api/users/search   - Search users for matching
```

### Matches
```
GET    /api/matches        - Get user's matches
POST   /api/matches        - Save a new match
DELETE /api/matches/:id    - Remove a match
```

### Resources
```
GET    /api/resources      - Get all resources (with filters)
POST   /api/resources      - Create new resource
PUT    /api/resources/:id  - Update resource
POST   /api/resources/:id/upvote - Upvote resource
```

### AI Tools
```
POST   /api/ai/skill-gap   - Analyze skill gap
POST   /api/ai/project-idea - Generate project idea
POST   /api/ai/recommendations - Get AI resource recommendations
```

---

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Restrict cross-origin requests
- **SQL Injection Prevention**: Prisma ORM parameterized queries

---

## 📊 Performance Optimizations

- **Code Splitting**: React Router lazy loading
- **Image Optimization**: Lazy loading and compression
- **Caching**: Browser caching for static assets
- **Bundle Size**: Tree shaking and minification
- **Database Indexing**: Optimized queries with Prisma

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Rangesh Gupta, Aditya Agrahari, Farhan Ansari, Ansh Jaiswal.** - *Initial work* - [https://github.com/anshjaiswal2911-tech/find-teammates-website]
---

## 🙏 Acknowledgments

- Built for hackathon MVPs and college developer communities
- Inspired by modern SaaS platforms
- Powered by open-source technologies

---

## 📞 Support

For questions or support:
- Email: support@collabnest.dev
- Discord: [Join our community](https://discord.gg/collabnest)
- Twitter: [@collabnest](https://twitter.com/collabnest)

---

## 🗺 Roadmap

- [ ] Real-time chat between matched developers
- [ ] Video call integration for team meetings
- [ ] GitHub integration for project collaboration
- [ ] Hackathon calendar and registration
- [ ] Team formation and project submission portal
- [ ] Mentor matching system
- [ ] Achievement badges and leaderboards
- [ ] Mobile app (React Native)

---

**Built with ❤️ for developers, by developers**
