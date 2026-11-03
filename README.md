# DevSync: Real-Time Engineering Collaboration Platform

DevSync is a full-stack SaaS application designed for software development teams. It provides a real-time, drag-and-drop Kanban board for task management, featuring role-based access control and instant WebSocket synchronization across multiple clients.

## 🚀 Key Features

*   **Real-Time Synchronization:** Integrated `Socket.io` to instantly broadcast task updates (create, move, delete) to all active users in a specific workspace room without requiring page reloads.
*   **Interactive Kanban Board:** Implemented a smooth drag-and-drop interface using `@hello-pangea/dnd`, allowing users to seamlessly transition tasks across status columns (To Do, In Progress, In Review, Done).
*   **Secure Authentication:** Engineered JWT-based authentication with `bcrypt` password hashing and protected API routes.
*   **Role-Based Access Control (RBAC):** Built a multi-tenant workspace architecture where only designated Workspace Admins or the original Task Creators have permission to delete tasks.
*   **Optimistic UI Updates:** Designed the React frontend to update the UI state instantly before the backend confirms the HTTP request, resulting in a snappy, zero-latency feel for the user.

## 💻 Tech Stack

**Frontend:**
*   React 18 (Vite)
*   Tailwind CSS (Styling & UI)
*   Socket.io-client (WebSockets)
*   @hello-pangea/dnd (Drag and Drop)
*   Axios (HTTP Client with Interceptors)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose (Database & ODM)
*   Socket.io (WebSocket Server)
*   JSON Web Tokens (JWT) (Auth)

## 🛠️ Local Installation & Setup

**1. Clone the repository:**
\`\`\`bash
git clone https://github.com/Anmol-arya/DevSync.git
cd DevSync
\`\`\`

**2. Setup the Backend:**
\`\`\`bash
cd devsync-backend
npm install
\`\`\`
Create a `.env` file in the `devsync-backend` directory with the following variables:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

**3. Setup the Frontend:**
Open a new terminal window:
\`\`\`bash
cd devsync-frontend
npm install
npm run dev
\`\`\`
The application will be running at `http://localhost:5173`.
