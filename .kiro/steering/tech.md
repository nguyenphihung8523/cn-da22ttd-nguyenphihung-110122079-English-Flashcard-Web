---
inclusion: always
---

# Tech Stack

## Frontend

- **Framework**: React 18.2
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS 3.4 with PostCSS
- **HTTP Client**: Axios
- **Build Tool**: Create React App (react-scripts)

## Backend

- **Runtime**: Node.js
- **Framework**: Express 4.18
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs for password hashing
- **CORS**: Enabled for cross-origin requests
- **Environment**: dotenv for configuration

## Development Tools

- **Backend Dev Server**: nodemon (auto-restart)
- **Frontend Dev Server**: react-scripts (hot reload)

## Common Commands

### Backend
```bash
cd backend
npm install              # Install dependencies
npm run dev             # Start development server (nodemon)
npm start               # Start production server
node seedFlashcards.js  # Seed database with sample data
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm start           # Start dev server (http://localhost:3000)
npm run build       # Build for production
npm test            # Run tests
```

## Environment Configuration

Backend requires `.env` file (copy from `.env.example`):
- `MONGO_URI`: MongoDB connection string (default: mongodb://127.0.0.1:27017/english_flashcard_db)
- `JWT_SECRET`: Secret key for JWT signing (default: secretkey123)
- `PORT`: Server port (default: 5000)

## API Endpoints

Base URL: `http://localhost:5000/api`

- `/api/auth` - Authentication (register, login)
- `/api/flashcards` - Flashcard CRUD
- `/api/user` - User profile management
- `/api/learning` - Learning history tracking
- `/api/quiz` - Quiz functionality
