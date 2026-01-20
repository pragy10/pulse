# Pulse - SDG-Based Social Media Platform

## Project Overview
Pulse is a specialized social media platform designed to track, classify, and gamify sustainable human actions aligned with the United Nations' 17 Sustainable Development Goals (SDGs). Developed for UNCT India in collaboration with NITI Aayog, Pulse empowers citizens to share their eco-friendly activities, receive AI-driven impact assessments, and engage with like-minded sustainability advocates.

## Problem It Solves
Existing social media platforms lack mechanisms to systematically track, classify, and recognize sustainable actions. There is no dedicated space where individuals can:
- Share eco-friendly activities and get quantifiable recognition.
- Understand which UN SDG their actions support.
- Join communities focused on specific sustainability goals.
- Measure collective impact through transparent metrics.

Citizens performing sustainable actions (waste reduction, renewable energy adoption, community volunteering) have no platform to receive automated feedback on their SDG contributions or connect with others working toward similar goals.

## Target Users (Personas)

### General User (Contributor)
- **Age**: 18-60 years
- **Characteristics**: Sustainability-conscious citizens, NGO members, environmental advocates.
- **Goals**: Track personal green actions, earn recognition through Impact Scores, discover SDG communities.
- **Technical Competency**: Moderate - familiar with social media platforms.
- **Usage Pattern**: Daily interaction to log actions and view "Green Karma" scores.

### Community Moderator
- **Characteristics**: Trusted users managing SDG-specific communities.
- **Goals**: Maintain content quality, enforce community guidelines, highlight impactful posts.
- **Permissions**: Delete posts/comments, mute users, pin important content.
- **Technical Competency**: Moderate

### Administrator
- **Characteristics**: UNCT India and NITI Aayog staff overseeing platform governance.
- **Goals**: Manage users, configure AI scoring weights, monitor system health.
- **Permissions**: Full platform control including user role management and AI service oversight.
- **Technical Competency**: High

## Vision Statement
**To create the world's first AI-powered social platform where every sustainable action is recognized, classified, and celebrated—empowering individuals to visualize their contribution to the UN's 2030 Agenda while building vibrant communities around each of the 17 Sustainable Development Goals.**

## Key Features / Goals

### Core Features (Release 1.0)
- **AI-Powered SDG Classification**: Machine learning automatically categorizes posts into one of 17 UN SDGs within quickly.
- **Impact Scoring System**: Posts receive scores (0-100) based on SDG relevance and engagement, aggregated into user "Green Karma" .
- **Community-Based Feeds**: 17 default SDG communities (e.g., SDG-13 Climate Action) with customizable feeds.
- **Social Engagement**: Reddit-style upvote/downvote system and threaded comments.
- **Content Moderation**: Tools for moderators to manage posts, comments, and user behavior with full audit logging.
- **User Profiles**: Display username, bio, avatar, total Impact Score, and contribution history.
- **Secure Authentication**: JWT-based registration, login, and session management.

### Technical Architecture
- **Frontend**: React.js responsive web application (desktop + mobile)
- **Backend**: Node.js/Express REST API with MongoDB database
- **AI Service**: Python/FastAPI microservice for SDG classification
- **Storage**: AWS S3 for image/media uploads
- **Deployment**: Dockerized services with Docker Compose

## Success Metrics

### Usability Goals
- **90% of new users** can create their first post and view Impact Score within 5 minutes of registration.
- **80% of test users** can navigate the platform without assistance. 
- All frequent functions accessible within **2 clicks** from the main dashboard. 

### Performance Benchmarks
- Support **100 concurrent users** without performance degradation. 
- API response time for home feed: **< 500 milliseconds**.
- AI classification accuracy: **≥ 85%** on SDG test datasets. 

### Reliability & Security
- **99% uptime** during standard operation hours. 
- JWT authentication for all protected endpoints.
- Rate limiting: max 100 requests/minute to prevent DDoS attacks. 

### User Engagement
- Positive feedback on usability and gamification elements. 
- Active participation across all 17 SDG communities.
- Growing user Green Karma scores indicating sustained engagement.

## Assumptions & Constraints

### Assumptions
- Users have reliable internet access and basic social media familiarity. 
- English is the primary language for initial SDG classification. 
- Pre-trained ML models for SDG mapping are available and deployable.

### Constraints
- **Timeline**: 3-month development window.
- **Technology Stack**: Must use MERN stack (MongoDB, Express, React, Node.js).
- **Budget**: Free and open-source technologies only to minimize costs.
- **Deployment**: All services must be Docker-containerized.
- **AI Limitation**: No real-time model training in Release 1.0—inference only.

---

## 📂 Project Structure

```
pulse/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── server.js
│   ├── package.json
│   └── Dockerfile
│
├── ai-service/
│   ├── app/
│   │   ├── models/
│   │   ├── services/
│   │   ├── routes/
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md

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

### Option 1: Docker Compose 🐳

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

## 👥 Contributors

- Pragya Sekar
  
---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---
[UN SDG Goals](https://sdgs.un.org/goals)


