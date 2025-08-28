# **App Name**: ProjectZen

## Core Features:

- User Authentication & Authorization: Basic user sign-up/sign-in functionality with distinct user roles (Admin, Manager, Team Member) managed via environment variables, roles will restrict some functionalities.
- Project & Task Boards: Kanban-style boards for project and task management with drag-and-drop functionality for task status updates.
- Notifications: In-app alerts for task assignments and approaching due dates. Limited to UI alerts; no external notifications (email, SMS).
- Progress Dashboard: Dashboard providing a summary of project and task status using simple charts. This is mostly UI functionality; data is mocked or managed in the UI's state.
- File Attachment & Comments: Ability to attach files to tasks; limited to local storage, with support for threaded comments. Functionality managed primarily on the front end.
- AI Comment summarization: A tool to auto-summarize the user comments on each task. An LLM reasons over user input, in order to distill comments down to the central idea or important actions

## Style Guidelines:

- Primary color: Soft blue (#64B5F6), evokes trust and efficiency.
- Background color: Light gray (#F0F4F8), providing a clean and non-distracting backdrop.
- Accent color: Teal (#26A69A), signals important updates and calls-to-action.
- Body and headline font: 'Inter', a sans-serif for clean, modern readability.
- Minimalist icons to represent task status, user roles, and other project elements.
- Clean, card-based layouts to emphasize organization and clarity.
- Subtle transitions to indicate changes in task status and navigation, enhancing user experience.