# RJProject

### Plan Better. Work Smarter. Build Together.

A modern project management and team collaboration platform designed to help teams organize projects, manage tasks, communicate, and track progress in one centralized workspace.

<p align="center">

  ![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)
  ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)
  ![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)

</p>

---

## Overview

**RJProject** is a project management platform built for individuals, teams, and organizations that want a better way to manage their work.

Inspired by modern productivity platforms like Linear, ClickUp, and Trello, RJProject combines project management, task tracking, team collaboration, and communication in one streamlined workspace.

Our goal is to make teamwork more organized, productive, and efficient.

## Features

### Workspace Management
- Create multiple workspaces.
- Invite team members.
- Workspace switching.
- Role-based permissions.
- Workspace customization.
- Member management.

### Project Management
- Create and manage projects.
- Project descriptions and cover images.
- Project priorities and statuses.
- Project member assignments.
- Project progress tracking.
- Archive and restore projects.
- Favorite projects.

### Task Management
- Create, edit, and delete tasks.
- Kanban board.
- List view.
- Drag-and-drop task management.
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
- Direct messages.
- Group conversations.
- Project discussions.
- Real-time messaging.
- Message reactions.
- File sharing.

### Calendar & Timeline
- Monthly calendar.
- Weekly calendar.
- Daily calendar.
- Task deadlines.
- Project milestones.
- Project timeline.

### Notifications
- Task assignment alerts.
- Project updates.
- Mentions and comments.
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
- Google OAuth.
- Secure authentication.
- Protected routes.
- Role-based access control.
- Supabase Row Level Security.
- Secure database access.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Application framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Lucide React | Icon library |
| Supabase | Backend platform |
| PostgreSQL | Main database |
| Supabase Auth | Authentication |
| Supabase Realtime | Real-time communication |
| Supabase Storage | File storage |
| Vercel | Deployment |

---

## Design System

RJProject uses a premium **Midnight Dark SaaS** visual identity.

| Element | Color |
|---|---|
| Background | `#090B12` |
| Sidebar | `#0D1019` |
| Card | `#111522` |
| Secondary Surface | `#171D2B` |
| Border | `#252B3A` |
| Primary Accent | `#8B5CF6` |
| Secondary Accent | `#38BDF8` |
| Main Text | `#F1F5F9` |
| Muted Text | `#8993A4` |

The design focuses on clean layouts, consistent spacing, readable typography, subtle interactions, and responsive components.

---

## Project Structure

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

*This represents the intended project architecture. Actual files may vary depending on implementation.*

---

## Database

RJProject uses **Supabase PostgreSQL** as its primary database.

Main database tables:

| Table | Description |
|---|---|
| `profiles` | User profiles |
| `workspaces` | Workspace information |
| `workspace_members` | Workspace membership |
| `workspace_invitations` | Member invitations |
| `projects` | Project information |
| `project_members` | Project membership |
| `tasks` | Task information |
| `task_assignees` | Task assignments |
| `task_labels` | Task label relationships |
| `labels` | Task labels |
| `subtasks` | Subtasks |
| `task_checklists` | Task checklists |
| `task_comments` | Task comments |
| `task_attachments` | Task files |
| `task_activity` | Task activity history |
| `conversations` | Chat conversations |
| `conversation_members` | Conversation participants |
| `messages` | Chat messages |
| `message_reactions` | Message reactions |
| `notifications` | User notifications |
| `calendar_events` | Calendar events |
| `project_milestones` | Project milestones |
| `favorites` | User favorites |

Database security is handled through PostgreSQL permissions and Supabase Row Level Security (RLS).

---

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

**Important:** Never expose your Supabase secret key in client-side code or commit environment files containing secrets to GitHub.

### 4. Configure Supabase

1. Create a new Supabase project.
2. Configure Google OAuth if enabled.
3. Apply the database migrations.
4. Configure Row Level Security policies.
5. Create the required Storage buckets.
6. Enable Realtime for supported tables.

### 5. Start Development Server

```bash
npm run dev
```

Open your browser:

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

---

## Deployment

RJProject is designed to be deployed using Vercel.

1. Push your project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Connect your Supabase project.
5. Deploy the application.

Make sure database migrations, authentication settings, and environment variables are configured correctly before deployment.

---

## Security

RJProject follows modern application security practices:

- Server-side authentication verification.
- Row Level Security.
- Role-based authorization.
- Protected API endpoints.
- Environment-based secrets.
- Input validation.
- Secure file access.
- Workspace data isolation.

Never commit private credentials, API secrets, or database passwords to the repository.

---

## Development Status

RJProject is under active development.

Features, architecture, and implementation details may evolve as development progresses.

Some features may require additional configuration or external service credentials.

---

## Roadmap

- [ ] Authentication system
- [ ] Google OAuth integration
- [ ] Workspace management
- [ ] Member invitations
- [ ] Role-based permissions
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

---

## Contributing

Contributions, suggestions, and bug reports are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

---

## License

This project is currently distributed without a declared open-source license.

All rights reserved unless otherwise specified by the project owner.

---

<p align="center">

  **RJProject**

  *Plan Better. Work Smarter. Build Together.*

  Built with passion by **Ramardo**.

  © 2026 Ramaro. All rights reserved.

</p>
