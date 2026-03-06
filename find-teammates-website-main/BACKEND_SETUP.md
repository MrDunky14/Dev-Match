# CollabNest Backend Setup Guide

This guide will help you set up the backend for CollabNest to connect with the frontend application.

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud like Supabase, Neon, Railway)
- Basic knowledge of Express.js and Prisma

---

## 🚀 Quick Setup

### 1. Initialize Backend Project

```bash
mkdir collabnest-backend
cd collabnest-backend
npm init -y
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install express cors dotenv bcryptjs jsonwebtoken
npm install @prisma/client openai

# Dev dependencies
npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken
npm install -D prisma nodemon ts-node

# Security & Validation
npm install helmet express-rate-limit joi
```

### 3. Initialize TypeScript

```bash
npx tsc --init
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 4. Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma`
- `.env` file

---

## 🗄 Database Schema

Update `prisma/schema.prisma`:

```prisma
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
  experience   Experience @default(Beginner)
  bio          String?
  availability Availability @default(Weekends)
  profileImage String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  resources    Resource[]
  matchesSent  Match[]    @relation("MatchUser")
  matchesReceived Match[] @relation("MatchedUser")
  
  @@index([email])
}

model Resource {
  id          String   @id @default(uuid())
  title       String
  link        String
  category    Category
  tags        String[]
  upvotes     Int      @default(0)
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  createdBy   String
  user        User     @relation(fields: [createdBy], references: [id], onDelete: Cascade)
  
  @@index([category])
  @@index([createdAt])
}

model Match {
  id                  String   @id @default(uuid())
  userId              String
  matchedUserId       String
  compatibilityScore  Int
  explanation         String
  skillOverlap        String[]
  complementarySkills String[]
  createdAt           DateTime @default(now())
  
  user                User     @relation("MatchUser", fields: [userId], references: [id], onDelete: Cascade)
  matchedUser         User     @relation("MatchedUser", fields: [matchedUserId], references: [id], onDelete: Cascade)
  
  @@unique([userId, matchedUserId])
  @@index([userId])
  @@index([matchedUserId])
}

enum Experience {
  Beginner
  Intermediate
  Advanced
}

enum Availability {
  FullTime  @map("Full-time")
  PartTime  @map("Part-time")
  Weekends
}

enum Category {
  GitHub
  YouTube
  Docs
  Course
  Blog
}
```

### Run Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 📁 Backend Project Structure

```
collabnest-backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── matchController.ts
│   │   ├── resourceController.ts
│   │   └── aiController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validate.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── matchRoutes.ts
│   │   ├── resourceRoutes.ts
│   │   └── aiRoutes.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── matchingService.ts
│   │   └── aiService.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── validation.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── .env
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 🔧 Implementation Examples

### 1. Main Server (`src/index.ts`)

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import matchRoutes from './routes/matchRoutes';
import resourceRoutes from './routes/resourceRoutes';
import aiRoutes from './routes/aiRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 2. Auth Middleware (`src/middleware/auth.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        skills: true,
        interests: true,
        experience: true,
        bio: true,
        availability: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 3. Auth Controller (`src/controllers/authController.ts`)

```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, college } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        college,
        skills: [],
        interests: [],
      },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        skills: true,
        interests: true,
        experience: true,
        bio: true,
        availability: true,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
```

### 4. Matching Service (`src/services/matchingService.ts`)

```typescript
import { User } from '@prisma/client';

export function calculateCompatibility(userA: User, userB: User) {
  // Skill overlap (40%)
  const skillOverlap = userA.skills.filter(skill => 
    userB.skills.includes(skill)
  );
  const skillOverlapScore = 
    (skillOverlap.length / Math.max(userA.skills.length, userB.skills.length)) * 40;

  // Complementary skills (30%)
  const complementarySkills = userA.skills.filter(skill => 
    !userB.skills.includes(skill)
  );
  const complementaryScore = Math.min((complementarySkills.length / 5) * 30, 30);

  // Interest similarity (20%)
  const interestOverlap = userA.interests.filter(interest => 
    userB.interests.includes(interest)
  );
  const interestScore = 
    (interestOverlap.length / Math.max(userA.interests.length, userB.interests.length)) * 20;

  // Availability match (10%)
  const availabilityScore = userA.availability === userB.availability ? 10 : 5;

  const totalScore = Math.round(
    skillOverlapScore + complementaryScore + interestScore + availabilityScore
  );

  return {
    compatibilityScore: totalScore,
    skillOverlap,
    complementarySkills: complementarySkills.slice(0, 3),
    explanation: generateExplanation(totalScore, skillOverlap, complementarySkills, interestOverlap),
  };
}

function generateExplanation(
  score: number,
  skillOverlap: string[],
  complementarySkills: string[],
  interestOverlap: string[]
): string {
  const parts: string[] = [];

  if (score >= 80) parts.push('Excellent match!');
  else if (score >= 60) parts.push('Great potential!');
  else if (score >= 40) parts.push('Good collaboration opportunity!');
  else parts.push('Potential for diverse perspectives!');

  if (skillOverlap.length > 0) {
    parts.push(`${skillOverlap.length} shared skills`);
  }
  if (complementarySkills.length > 0) {
    parts.push(`${complementarySkills.length} complementary skills`);
  }
  if (interestOverlap.length > 0) {
    parts.push(`${interestOverlap.length} common interests`);
  }

  return parts.join(' • ');
}
```

### 5. AI Service with OpenAI (`src/services/aiService.ts`)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateProjectIdea(skills: string[], theme?: string) {
  try {
    const prompt = `Generate a hackathon project idea for a developer with these skills: ${skills.join(', ')}.
    ${theme ? `The hackathon theme is: ${theme}.` : ''}
    
    Provide:
    1. Project title
    2. Problem statement
    3. 5 key features
    4. Recommended tech stack (based on the skills)
    5. MVP scope
    6. Difficulty level (Easy/Medium/Hard)
    
    Format as JSON.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate project idea');
  }
}

export async function analyzeSkillGap(currentSkills: string[], targetRole: string) {
  // Implementation similar to frontend aiService.ts
  // Can also use OpenAI for more intelligent analysis
}
```

---

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Password Hashing**: Always use bcrypt with salt rounds >= 10
3. **JWT Secret**: Use a strong, random secret (min 32 characters)
4. **Rate Limiting**: Protect against brute force attacks
5. **Input Validation**: Validate all user inputs with Joi
6. **SQL Injection**: Use Prisma's parameterized queries
7. **CORS**: Only allow trusted frontend origins
8. **Helmet**: Use helmet.js for security headers

---

## 📝 Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

---

## 🚀 Deployment

### Railway

1. Connect your GitHub repo
2. Add environment variables
3. Railway will auto-detect and deploy

### Render

1. Create new Web Service
2. Connect repository
3. Build command: `npm install && npx prisma generate && npm run build`
4. Start command: `npm start`

### Heroku

```bash
heroku create collabnest-api
heroku addons:create heroku-postgresql
git push heroku main
```

---

## 📞 Support

For backend issues, check:
- Prisma documentation: https://www.prisma.io/docs
- Express.js guides: https://expressjs.com
- OpenAI API docs: https://platform.openai.com/docs

---

**Happy Coding! 🚀**
