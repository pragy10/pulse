# MoSCoW Prioritization - Pulse Social Media Platform

## Must Have (Critical for Release 1.0) 🔴

These features are absolutely essential and non-negotiable for the MVP to function.

| # | User Story | Priority | Justification |
|---|------------|----------|---------------|
| 1 | User Registration | Must Have | Core functionality - users need accounts to access platform |
| 2 | User Login | Must Have | Authentication required for all features |
| 3 | View User Profile | Must Have | Users must see their Green Karma scores and contribution history |
| 5 | Protected Access with JWT | Must Have | Security requirement - protect user data and API endpoints |
| 6 | Create Post | Must Have | Primary user action - core feature of the platform |
| 7 | AI SDG Classification | Must Have | Core innovation that differentiates this platform - automatically tags posts |
| 8 | Impact Score for Posts | Must Have | Core gamification feature - motivates user engagement |
| 9 | Home Feed (Joined Communities) | Must Have | Users need to see content from their communities |
| 12 | View All SDG Communities | Must Have | Users must discover and browse the 17 SDG communities |
| 13 | Join/Leave Community | Must Have | Customization - users control their feed content |
| 14 | View Community Feed | Must Have | Users need to view posts filtered by specific SDG |
| 15 | Upvote/Downvote Posts | Must Have | Core engagement feature - Reddit-style interaction |
| 16 | Add Comment to Post | Must Have | Social interaction - enables discussion and community building |
| 24 | Image Upload to S3 | Must Have | Media support - posts need images for better engagement |

**Total Must-Have: 14 stories**

---

## Should Have (Important but not blocking) 🟠

These features enhance user experience significantly but the MVP can launch without them.

| # | User Story | Priority | Justification |
|---|------------|----------|---------------|
| 4 | Edit User Profile | Should Have | Personalization feature - can be added post-launch |
| 10 | Sort Feed (Hot/New/Top) | Should Have | UX improvement - default chronological sorting works initially |
| 11 | Edit/Delete Own Post | Should Have | Content management - admin can handle manually at first |
| 17 | Reply to Comments (Threaded) | Should Have | Enhanced discussion - flat comments work initially |
| 18 | Delete Own Comment | Should Have | Content control - moderation can handle initially |
| 19 | Assign Community Moderators | Should Have | Moderation setup - can be manual until user base grows |
| 20 | Moderator Delete Post/Comment | Should Have | Content quality - admin can handle initially with small user base |
| 22 | Admin User Management Dashboard | Should Have | Admin tools - command line admin works initially |

**Total Should-Have: 8 stories**

---

## Could Have (Nice to have if time permits) 🟡

Desirable features that add value but can wait for future releases.

| # | User Story | Priority | Justification |
|---|------------|----------|---------------|
| 21 | Moderator Mute User | Could Have | Advanced moderation - ban feature sufficient initially |
| 23 | Configure Impact Score Weights | Could Have | Admin flexibility - hardcoded weights work for Release 1.0 |
| 25 | AI Service Health Visibility | Could Have | Monitoring feature - server logs sufficient initially |

**Total Could-Have: 3 stories**

---

## Won't Have (Future releases) ⚪

Features explicitly excluded from Release 1.0 per project scope and timeline constraints.

| Feature | Reason for Exclusion |
|---------|---------------------|
| Advanced Analytics Dashboard | Complex feature requiring data visualization - planned for Release 2.0  |
| Push Notifications | Requires real-time infrastructure setup - out of scope for 3-month timeline  |
| Multi-language Support | AI model currently trained for English only  |
| Email Verification System | Optional dependency - basic auth sufficient for MVP  |
| Real-time Chat/Messaging | Not core to SDG tracking mission - future consideration  |
| Mobile App (iOS/Android) | Web responsive design sufficient - native apps in Release 2.0  |

---

## Summary

| Priority | Count | % of Total | 
|----------|-------|------------|
| **Must Have** | 14 | 56% | 
| **Should Have** | 8 | 32% | 
| **Could Have** | 3 | 12% |
| **Won't Have** | 6 | N/A | 
| **Total Stories** | **25** | **100%** | 

---

**Minimum Viable Product (MVP):**
The 14 **Must-Have** stories alone constitute a functional, deployable platform that meets the core project objectives of SDG classification and gamification.

---


