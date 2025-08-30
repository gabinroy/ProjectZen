# Prompt Log – ProjectZen (AI-Powered Project Management App)

---

### Step 1 – Authentication & Authorization

**Human:**  
You will build a minimal project management web application using only AI-generated code via prompt engineering. Core capabilities must be fully prompt-driven.  
📌 Step 1: Authentication & Authorization  
Prompt the AI to scaffold user sign-up, sign-in, and role-based access (Admin, Manager, Team Member).

**AI:**  
Scaffolded authentication system with sign-up, sign-in, and role-based access. Roles are enforced at the UI level. No default role yet for new users.

---

### Step 2 – Project & Task Boards

**Human:**  
📌 Step 2: Project & Task Boards  
Generate Kanban-style boards, task creation forms, drag-and-drop columns, and task detail views.

**AI:**  
Implemented Kanban board with draggable task cards and task creation modal. UI-only state handling at this stage.

---

### Step 3 – Notifications

**Human:**  
📌 Step 3: Notifications  
Implement in-app alerts for task assignments and upcoming due dates.

**AI:**  
In-app notifications implemented (UI alerts only). Triggered on task assignment and due date warnings.

---

### Step 4 – Progress Dashboard

**Human:**  
📌 Step 4: Progress Dashboard  
Create charts and visualizations to track project and task status.

**AI:**  
Dashboard with charts (mock data). Visualizes task progress across statuses.

---

### Step 5 – File Attachments & Comments

**Human:**  
📌 Step 5: File Attachment & Comments  
Enable file uploads to tasks and threaded comments.

**AI:**  
Added file attachment to tasks (local storage only). Threaded comments supported. AI-powered summarization of comments implemented using Google Genkit integration - automatically distills task comments into key insights and actionable items.

---

### Authentication Improvements

**Human:**  
For login, password is must. In the database, can you update the email with corresponding password with assigned role? Also give me a table.

**AI:**  
Updated login to require a password. Added seeded users:

| Email             | Password         | Role        |
| ----------------- | ---------------- | ----------- |
| alex@example.com  | password-admin   | Admin       |
| jane@example.com  | password-manager | Manager     |
| sam@example.com   | password-member  | Team Member |
| casey@example.com | password-member2 | Team Member |

---

**Human:**  
Can you tell me what role is assigned as default for new (signup) personals?

**AI:**  
Currently none. Do you want me to assign "Team Member" as default?

**Human:**  
Yes please. Also add option for Admin to change existing roles.

**AI:**  
Done ✅ New users default to "Team Member". Added Admin-only role management page.

---

### Project & Team Management

**Human:**  
Can you make a change that the Admin can add new projects and assign a Manager? The Manager can add team member. Admin can also add team member if they wish.

**AI:**  
Implemented:

- Admin creates new projects and assigns a Manager.
- Inside projects: both Admin and Manager can manage team members.

---

### Debugging & Fixes

**Human:**  
Try fixing this error: _Build Error: Module not found: Can't resolve '@/co..._

**AI:**  
Fixed missing `Command` component. Updated `package.json` with required dependency.

---

### UI Polish

**Human:**  
On login page in email, please remove the demo text.

**AI:**  
Removed default demo email. Login input is empty by default.

---

### Tech Stack & Architecture

**Current Implementation:**

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **AI Integration**: Google Genkit for LLM-powered comment summarization
- **State Management**: React Context API
- **Charts**: Recharts for data visualization
- **Development**: Turbopack for fast development builds

### Project Status

✅ **Fully functional prototype with AI integration complete.**

**Key Achievements:**

- Complete role-based authentication system
- Kanban-style project management with drag-and-drop
- AI-powered comment summarization using Genkit
- Responsive dashboard with data visualization
- File attachment and threaded commenting
- Admin role management and project assignment workflows

**Demo Available**: http://localhost:9002 with seeded user accounts
