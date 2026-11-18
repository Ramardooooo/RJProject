# RJProject

\<p align="center">
&#x20; \<strong>Plan Better. Work Smarter. Build Together.\</strong>
\</p>

\<p align="center">   A modern project management and team collaboration platform. \</p>

\<p align="center">   \<img src="[https://img.shields.io/badge/Next.js-App_Router-black?logo=next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=next.js)" />   \<img src="[https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)" />   \<img src="[https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)" />   \<img src="[https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)" /> \</p>

---

## Overview

**RJProject** is a modern project management platform designed to help individuals and teams organize projects, manage tasks, collaborate, and track progress in one centralized workspace.

Inspired by modern productivity platforms such as Linear, ClickUp, and Trello, RJProject combines powerful project management capabilities with a clean, intuitive, and professional user experience.

Whether you're managing personal projects or collaborating with an entire team, RJProject provides the tools needed to keep everything organized and moving forward.

## Features

### Workspace Management

- Create and manage multiple workspaces.
- Invite members to your workspace.
- Workspace role management.
- Workspace switching.
- Member permissions.
- Workspace customization.

### Project Management

- Create multiple projects.
- Project descriptions and cover images.
- Project members.
- Project priorities and statuses.
- Project progress tracking.
- Project archiving.
- Favorite projects.

### Task Management

- Create, edit, and delete tasks.
- Kanban board with drag and drop.
- List view.
- Task priorities.
- Task assignments.
- Due dates and deadlines.
- Subtasks and checklists.
- Labels and categories.
- Task comments.
- File attachments.
- Task activity history.

### Team Collaboration

- Team member directory.
- Member profiles.
- Direct messaging.
- Group conversations.
- Project discussions.
- Real-time messaging.
- Message reactions.
- File sharing.

### Calendar & Timeline

- Monthly calendar.
- Weekly calendar.
- Daily schedule.
- Task deadlines.
- Project milestones.
- Project timeline.

### Notifications

- Task assignment notifications.
- Project updates.
- Mentions.
- Comments.
- Workspace invitations.
- Deadline reminders.
- Read and unread notifications.

### Dashboard & Analytics

- Total projects.
- Active projects.
- Completed projects.
- Task statistics.
- Overdue tasks.
- Team workload.
- Project progress.
- Productivity reports.

### Authentication & Security

- Google OAuth authentication.
- Secure user sessions.
- Protected routes.
- Role-based access control.
- Supabase Row Level Security.
- Secure database access.

## Technology Stack

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| Next.js           | Application framework   |
| TypeScript        | Type safety             |
| Tailwind CSS      | Styling                 |
| shadcn/ui         | UI components           |
| Lucide React      | Icons                   |
| Supabase          | Backend platform        |
| PostgreSQL        | Main database           |
| Supabase Auth     | Authentication          |
| Supabase Realtime | Real-time communication |
| Supabase Storage  | File storage            |
| Vercel            | Deployment              |

## Design System

RJProject uses a premium **Midnight Dark SaaS** visual identity.

| Element           | Color     |
| ----------------- | --------- |
| Background        | `#090B12` |
| Sidebar           | `#0D1019` |
| Card              | `#111522` |
| Secondary Surface | `#171D2B` |
| Border            | `#252B3A` |
| Primary           | `#8B5CF6` |
| Secondary         | `#38BDF8` |
| Main Text         | `#F1F5F9` |
| Muted Text        | `#8993A4` |

The interface focuses on simplicity, readability, consistency, and usability.

## Architecture

RJProject uses a modern web application architecture.

```text
RJProject/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── chat/
│   ├── hooks/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── utils/
│   │   └── validations/
│   ├── services/
│   ├── types/
│   └── styles/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

*The structure above represents the intended architecture and may evolve during development.*

## Database

RJProject uses **Supabase PostgreSQL** as its primary database.

Main database tables:

- `profiles`
- `workspaces`
- `workspace_members`
- `workspace_invitations`
- `projects`
- `project_members`
- `tasks`
- `task_assignees`
- `task_labels`
- `labels`
- `subtasks`
- `task_checklists`
- `task_comments`
- `task_attachments`
- `task_activity`
- `conversations`
- `conversation_members`
- `messages`
- `message_reactions`
- `notifications`
- `calendar_events`
- `project_milestones`
- `favorites`

Database access is protected using Supabase Row Level Security (RLS).

## Getting Started

### Requirements

Make sure you have installed:

- Node.js 20 or newer.
- npm.
- Git.
- A Supabase account.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/RJProject.git

cd RJProject
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY

SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SECRET_KEY
```

Never expose your Supabase secret key in client-side code or commit `.env.local` to GitHub.

### 4. Configure Supabase

1. Create a new Supabase project.
2. Configure Google OAuth if Google login is enabled.
3. Apply the database migrations.
4. Configure Row Level Security policies.
5. Create the required Storage buckets.
6. Configure Realtime for supported tables.

### 5. Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 6. Build for Production

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Deployment

RJProject is designed to be deployed on Vercel.

1. Push your repository to GitHub.
2. Import the repository into Vercel.
3. Configure environment variables.
4. Connect your Supabase project.
5. Deploy the application.

Make sure all required environment variables and database migrations are configured before deployment.

## Security

RJProject follows security best practices:

- Server-side authentication verification.
- Database Row Level Security.
- Role-based authorization.
- Protected API endpoints.
- Environment-based secrets.
- Input validation.
- Secure file access.
- Workspace data isolation.

Never share your database credentials, OAuth secrets, or service role keys publicly.

## Development Status

RJProject is under active development.

Features and implementation details may change as development progresses.

## Roadmap

- [ ] Authentication system
- [ ] Google OAuth
- [ ] Workspace management
- [ ] Member invitations
- [ ] Project management
- [ ] Task management
- [ ] Kanban board
- [ ] List view
- [ ] Calendar and timeline
- [ ] Team management
- [ ] Real-time messaging
- [ ] Notifications
- [ ] File attachments
- [ ] Reports and analytics
- [ ] Responsive mobile interface
- [ ] Production deployment

## Contributing

Contributions, suggestions, and bug reports are welcome.

If you want to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is currently distributed without a declared open-source license.

All rights reserved unless otherwise specified by the project owner.

---

---

<p align="center">
  <strong>RJProject</strong>
  <br />
  Plan Better. Work Smarter. Build Together.
  <br /><br />
  Built with passion by <strong>Ramaro</strong>.
  <br />
  <sub>© 2026 Ramardo. All rights reserved.</sub>
</p>
