# Live Polling System Frontend

This is the React + Vite + Redux frontend for the Live Polling System. It supports real-time polling, chat, and participants management for both teachers and students, matching the provided Figma design and color palette.

## Features
- Role selection: Student or Teacher
- Teacher: Create polls, view live results, manage participants, view poll history
- Student: Join with a unique name (per tab), answer polls, see live results
- Real-time chat and participants list (with kick-out)
- Responsive, modern UI

## Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the frontend:**
   ```bash
   npm run dev
   ```
3. **Backend:**
   Make sure the backend (Node.js/Express/Socket.io) is running on `http://localhost:5000` (or update `src/socket.js` if different).

## Usage
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Choose your role (Student or Teacher).
- As a student, enter your name (unique per tab).
- As a teacher, create a poll and monitor results.
- Use the floating button (bottom right) to open chat/participants modal.
- Teachers can kick students from the participants tab.
- View poll history from the Teacher Dashboard.

## Testing
- Open multiple tabs/windows to simulate multiple students and a teacher.
- Try voting, chatting, and kicking participants.
- Test on different devices/screen sizes.
- Refresh tabs to check session persistence.

## Customization
- Color palette and styles are in `src/index.css` and component CSS files.
- Update backend URL in `src/socket.js` if needed.

## Feedback & Issues
If you find any bugs or want to request features, please open an issue or contact the developer.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
