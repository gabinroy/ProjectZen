# ProjectZen

A minimal, AI-powered project management application built with Next.js, featuring Kanban-style task boards, role-based authentication, and intelligent comment summarization.

## Features

- **User Authentication & Authorization**: Role-based access control with Admin, Manager, and Team Member roles
- **Project & Task Management**: Kanban-style boards with drag-and-drop functionality for seamless task status updates
- **AI-Powered Comment Summarization**: Automatically distill task comments into key insights and actionable items using LLM integration
- **Progress Dashboard**: Visual project and task status overview with interactive charts
- **File Attachments & Comments**: Support for task file attachments and threaded commenting system
- **Real-time Notifications**: In-app alerts for task assignments and approaching due dates
- **Responsive Design**: Clean, modern interface optimized for all devices

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **AI Integration**: Google Genkit for LLM-powered features
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## Design System

- **Primary Color**: Soft Blue (#64B5F6) - Trust and efficiency
- **Background**: Light Gray (#F0F4F8) - Clean, non-distracting backdrop
- **Accent Color**: Teal (#26A69A) - Important updates and CTAs
- **Typography**: Inter font family for modern readability
- **Layout**: Card-based design with subtle transitions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/gabinroy/ProjectZen.git
cd projectzen
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:9002](http://localhost:9002) in your browser

### AI Development

To work with AI features using Genkit:

```bash
# Start Genkit development server
npm run genkit:dev

# Start Genkit with file watching
npm run genkit:watch
```

## Demo Accounts

Use these credentials to explore different user roles and permissions:

| Email             | Password         | Role        |
| :---------------- | :--------------- | :---------- |
| alex@example.com  | password-admin   | Admin       |
| jane@example.com  | password-manager | Manager     |
| sam@example.com   | password-member  | Team Member |
| casey@example.com | password-member2 | Team Member |

## Available Scripts

- `npm run dev` - Start development server with Turbopack on port 9002
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with file watching

## Project Structure

```
src/
├── ai/                 # AI integration and flows
├── app/                # Next.js app router pages
├── components/         # Reusable UI components
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard components
│   ├── projects/      # Project management components
│   ├── tasks/         # Task management components
│   └── ui/            # Base UI components
├── contexts/          # React context providers
├── hooks/             # Custom React hooks
└── lib/               # Utilities and type definitions
```

## User Roles & Permissions

- **Admin**: Full system access, user management, all project operations
- **Manager**: Project creation, team management, task assignment
- **Team Member**: Task updates, commenting, file attachments

## Key Features in Detail

### Kanban Task Management

- Drag-and-drop task status updates (Todo → In Progress → Done)
- Task priority levels (Low, Medium, High)
- Due date tracking with notifications
- Multi-user task assignment

### AI Comment Summarization

- Automatically processes task comments using LLM
- Extracts key insights and action items
- Helps teams stay focused on important decisions

### Progress Tracking

- Visual project completion metrics
- Task distribution charts
- Team productivity insights
- Deadline monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support and questions, please contact the development team.
