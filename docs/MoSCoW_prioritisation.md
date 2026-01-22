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

**Reasoning:** Without these features, the platform cannot fulfill its core purpose of tracking and gamifying sustainable actions aligned with SDGs [file:35][file:32].

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

**Reasoning:** These features improve usability and platform management but aren't critical for initial launch. They can be added in Release 1.1 within the 3-month timeline [file:32].

---

## Could Have (Nice to have if time permits) 🟡

Desirable features that add value but can wait for future releases.

| # | User Story | Priority | Justification |
|---|------------|----------|---------------|
| 21 | Moderator Mute User | Could Have | Advanced moderation - ban feature sufficient initially |
| 23 | Configure Impact Score Weights | Could Have | Admin flexibility - hardcoded weights work for Release 1.0 |
| 25 | AI Service Health Visibility | Could Have | Monitoring feature - server logs sufficient initially |

**Total Could-Have: 3 stories**

**Reasoning:** These are polish features that improve admin/moderator experience but aren't needed for core functionality to work [file:35].

---

## Won't Have (Future releases) ⚪

Features explicitly excluded from Release 1.0 per project scope and timeline constraints.

| Feature | Reason for Exclusion |
|---------|---------------------|
| Advanced Analytics Dashboard | Complex feature requiring data visualization - planned for Release 2.0 [file:32] |
| Push Notifications | Requires real-time infrastructure setup - out of scope for 3-month timeline [file:32] |
| Multi-language Support | AI model currently trained for English only [file:35] |
| Email Verification System | Optional dependency - basic auth sufficient for MVP [file:35] |
| Real-time Chat/Messaging | Not core to SDG tracking mission - future consideration [file:32] |
| Mobile App (iOS/Android) | Web responsive design sufficient - native apps in Release 2.0 [file:32] |

**Reasoning:** These features require additional time, resources, or dependencies beyond the 3-month constraint [file:32][file:35].

---

## Summary

| Priority | Count | % of Total | Timeline |
|----------|-------|------------|----------|
| **Must Have** | 14 | 56% | Month 1-2 |
| **Should Have** | 8 | 32% | Month 2-3 |
| **Could Have** | 3 | 12% | Month 3 (if time) |
| **Won't Have** | 6 | N/A | Release 2.0+ |
| **Total Stories** | **25** | **100%** | 3 months |

---

## Development Timeline Impact

### Month 1 (Weeks 1-4)
Focus on **Must-Have** features:
- User authentication (Stories #1, #2, #3, #5)
- Post creation and AI classification (#6, #7, #8)
- Basic feed functionality (#9, #12, #13, #14)

### Month 2 (Weeks 5-8)
Complete **Must-Have** + Start **Should-Have**:
- Social features (#15, #16, #24)
- User profile editing (#4)
- Feed sorting (#10)
- Content management (#11, #17, #18)

### Month 3 (Weeks 9-12)
Complete **Should-Have** + **Could-Have** if time:
- Moderation tools (#19, #20, #21, #22)
- Admin configuration (#23, #25)
- Testing, bug fixes, deployment

---

## Risk Mitigation

**If timeline slips:**
- Drop **Could-Have** features (#21, #23, #25)
- Move **Should-Have** features (#17, #18, #19, #20, #21, #22) to Release 1.1

**Minimum Viable Product (MVP):**
The 14 **Must-Have** stories alone constitute a functional, deployable platform that meets the core project objectives of SDG classification and gamification [file:35][file:32].

---

## Alignment with Success Criteria

This prioritization ensures we meet project success criteria [file:32]:
- ✅ 85%+ AI classification accuracy (Story #7)
- ✅ Functional and user-friendly (Must-Have features)
- ✅ Gamification elements (Green Karma via Stories #8, #3)
- ✅ 3-month timeline feasible with Must-Have + Should-Have scope

---

**Prepared by:** [Your Name]  
**Date:** January 22, 2026  
**Project:** Pulse - SDG Social Media Platform  
**Version:** 1.0
