---

## 📂 Project Structure

```
pulse/
├── frontend/              # React.js frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Post.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── Comment.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── CommunityCard.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/         # Page-level components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── Communities.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/      # API calls
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── context/       # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── utils/         # Helper functions
│   │   │   └── helpers.js
│   │   ├── App.jsx        # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json
│   ├── .env
│   └── Dockerfile
│
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── models/        # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   ├── Comment.js
│   │   │   ├── Community.js
│   │   │   ├── Vote.js
│   │   │   ├── Membership.js
│   │   │   └── Moderator.js
│   │   ├── routes/        # API route definitions
│   │   │   ├── auth.js
│   │   │   ├── posts.js
│   │   │   ├── comments.js
│   │   │   ├── communities.js
│   │   │   ├── users.js
│   │   │   └── admin.js
│   │   ├── controllers/   # Business logic
│   │   │   ├── authController.js
│   │   │   ├── postController.js
│   │   │   ├── commentController.js
│   │   │   ├── communityController.js
│   │   │   ├── userController.js
│   │   │   └── adminController.js
│   │   ├── middleware/    # Auth, validation, rate limiting
│   │   │   ├── auth.js
│   │   │   ├── moderator.js
│   │   │   ├── admin.js
│   │   │   ├── validation.js
│   │   │   └── rateLimiter.js
│   │   ├── services/      # AI service integration
│   │   │   ├── aiService.js
│   │   │   ├── uploadService.js
│   │   │   └── impactScoreService.js
│   │   ├── config/        # Configuration
│   │   │   ├── database.js
│   │   │   └── constants.js
│   │   └── server.js      # Entry point
│   ├── package.json
│   ├── .env
│   └── Dockerfile
│
├── ai-service/            # Python/FastAPI AI microservice
│   ├── app/
│   │   ├── models/        # AI models
│   │   │   ├── __init__.py
│   │   │   └── sdg_classifier.py
│   │   ├── services/      # Classification & scoring
│   │   │   ├── __init__.py
│   │   │   ├── classification_service.py
│   │   │   └── impact_score_service.py
│   │   ├── routes/        # API endpoints
│   │   │   ├── __init__.py
│   │   │   └── classification.py
│   │   ├── utils/         # Helper functions
│   │   │   ├── __init__.py
│   │   │   └── preprocessing.py
│   │   └── main.py        # FastAPI app
│   ├── requirements.txt
│   ├── .env
│   └── Dockerfile
│
├── docker-compose.yml     # Multi-container orchestration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

---

## 🔧 Branching Strategy

We follow **GitHub Flow** for this project.

### Main Branch
- `main` - Production-ready code
- Protected branch, requires pull requests

### Feature Branches
Create feature branches for each user story:

```bash
# Format: feature/<issue-number>-<short-description>
git checkout -b feature/1-user-registration
git checkout -b feature/7-ai-sdg-classification
git checkout -b feature/15-voting-system
```

### Workflow
1. Create feature branch from `main`
2. Develop and commit changes
3. Push to GitHub
4. Create Pull Request
5. Review and merge to `main`

**Example:**
```bash
# Create and switch to feature branch
git checkout -b feature/6-create-post

# Make changes, then commit
git add .
git commit -m "Add post creation API endpoint"

# Push to GitHub
git push origin feature/6-create-post

# Create PR on GitHub web interface
# After review, merge to main
```

---

## 🚀 Quick Start – Local Development

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://python.org/))
- **Docker Desktop** ([Download](https://docker.com/products/docker-desktop))
- **MongoDB** (via Docker or local install)

---

### Option 1: Docker Compose (Recommended) 🐳

**Step 1: Clone the repository**
```bash
git clone https://github.com/<your-username>/pulse.git
cd pulse
```

**Step 2: Create environment files**

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/pulse
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
AI_SERVICE_URL=http://ai-service:8000
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Create `ai-service/.env`:
```env
ENVIRONMENT=development
```

**Step 3: Build and run with Docker Compose**
```bash
docker-compose up --build
```

**Step 4: Access the application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- AI Service: `http://localhost:8000/docs`

---

### Option 2: Local Development (Without Docker)

**Step 1: Install MongoDB locally**
```bash
# macOS (Homebrew)
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
mongod --dbpath=/path/to/data
```

**Step 2: Backend setup**
```bash
cd backend
npm install
npm run dev
```

**Step 3: AI Service setup**
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Step 4: Frontend setup**
```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Commands Reference

### Build individual services
```bash
docker build -t pulse-backend ./backend
docker build -t pulse-frontend ./frontend
docker build -t pulse-ai-service ./ai-service
```

### Run containers
```bash
docker-compose up          # Start all services
docker-compose up -d       # Start in detached mode
docker-compose down        # Stop all services
docker-compose logs -f     # View logs
```

### Rebuild after code changes
```bash
docker-compose up --build
```

### Access container shell
```bash
docker exec -it pulse-backend-1 sh
docker exec -it pulse-ai-service-1 bash
```

---

## 🛠️ Local Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 18+ | Backend runtime |
| **npm** | 9+ | Package manager |
| **Python** | 3.9+ | AI service runtime |
| **pip** | Latest | Python package manager |
| **Docker Desktop** | Latest | Containerization |
| **MongoDB** | 6.0+ | Database |
| **Git** | 2.0+ | Version control |
| **VS Code** | Latest | Code editor (recommended) |

### Recommended VS Code Extensions
- ESLint
- Prettier
- Python
- Docker
- MongoDB for VS Code
- Thunder Client (API testing)

---

## 🧪 Testing the Setup

### 1. Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# Should return:
# {"status":"OK","message":"Pulse Backend Server is running"}
```

### 2. Test AI Service
```bash
# Health check
curl http://localhost:8000/health

# Should return:
# {"status":"OK","message":"Pulse AI Service is running"}
```

### 3. Test Frontend
Open browser: `http://localhost:5173`
- Should see Pulse login/registration page
- No console errors

---

## 📸 Screenshots for Assignment

Take screenshots of:
1. ✅ Terminal showing `docker-compose up` success
2. ✅ Browser showing app running on `localhost:5173`
3. ✅ GitHub repo page showing branches
4. ✅ This README.md file on GitHub
5. ✅ Docker Desktop showing running containers

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process using port 5000 (macOS/Linux)
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### MongoDB connection failed
```bash
# Restart MongoDB container
docker-compose restart mongodb

# Check MongoDB logs
docker-compose logs mongodb
```

### AI Service not responding
```bash
# Rebuild AI service
docker-compose up --build ai-service
```

### Docker build fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

---

## 👥 Contributors

- [Your Name] - Full Stack Development
- [Team Member 2] - Frontend Development
- [Team Member 3] - AI/ML Integration

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📚 Additional Resources

- [GitHub Repository](https://github.com/<your-username>/pulse)
- [Project Wiki](https://github.com/<your-username>/pulse/wiki)
- [Issue Tracker](https://github.com/<your-username>/pulse/issues)
- [UN SDG Goals](https://sdgs.un.org/goals)
