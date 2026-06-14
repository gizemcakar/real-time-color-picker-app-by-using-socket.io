# Real-Time Color Picker App

This repository contains a small Socket.IO demo with two separate apps:

- `socket-backend`: an Express + Socket.IO server that stores the current color and broadcasts updates to connected clients.
- `socket-frontend`: a React app that lets users pick a color and sync it in real time across browsers.

## Project Structure

- `socket-backend/app.js` starts the WebSocket server on port `3001` by default.
- `socket-frontend/src/components/ColorPalette.js` contains the color picker UI and socket event handling.
- `socket-frontend/src/services/socketService.js` manages the client Socket.IO connection.

## Requirements

- Node.js 18 or newer
- npm

## Run The App

Start the backend first:

```bash
cd socket-backend
npm install
npm start
```

Then start the frontend in a second terminal:

```bash
cd socket-frontend
npm install
npm start
```

Open `http://localhost:3000` in your browser.

## How It Works

- When a client connects, it joins the `color_room` and receives the current background color.
- When a user selects and applies a color, the frontend sends `change_color` to the backend.
- The backend stores the latest color and broadcasts it to all other connected clients.

## Notes

- The backend listens on `http://localhost:3001` by default.
- The frontend is configured to connect to that backend URL.
- The frontend package currently has a `dev` script that references `server.js`, but the backend entry point in this repository is `socket-backend/app.js`, so use the separate start commands above.