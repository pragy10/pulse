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

