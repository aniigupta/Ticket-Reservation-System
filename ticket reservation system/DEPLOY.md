# Deployment Guide

This project is a Monolith MERN stack application. The React frontend is served by the Node.js/Express backend.

## Structure
- **Frontend**: Located in `src`, built using Vite.
- **Backend**: Located in `server`, uses Express and Mongoose.
- **Root**: `ticket reservation system` folder.

## Build Process
The root `package.json` contains scripts to handle the full lifecycle:

- `npm run dev`: Starts the frontend (Vite) server. Use `npm run dev:server` in parallel for backend.
- `npm run build`: Builds the React frontend into the `dist` folder.
- `npm start`: Starts the Node.js server, which serves the API and the static files from `dist`.

## Environment Variables
Ensure you have the following environment variables set in your deployment platform (Render, Heroku, Railway, etc.):

- `MONGO_URI`: Your MongoDB Connection String.
- `PORT`: (Optional) The port to run on, defaults to 5000. Most platforms set this automatically.

## Deployment Instructions (Generic)
1. Push this code to GitHub.
2. Connect your repository to a hosting service (e.g., Render.com Web Service).
3. **Important**: Since the application source code is in a subdirectory (`ticket reservation system`), you MUST set the **Root Directory** setting in your deployment service to:
   ```text
   ticket reservation system
   ```
4. Set the **Build Command** to:
   ```bash
   npm install && npm run build
   ```
5. Set the **Start Command** to:
   ```bash
   npm start
   ```
6. Add your `MONGO_URI` in the Environment Variables settings.

The server is configured to serve `index.html` for any unknown routes, enabling React Client-Side Routing.
