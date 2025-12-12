# AI-Created Math Websites Showcase

This website curates AI-created websites related to high school mathematics as part of our math class project. Students designed a UI poster that highlights math concepts they believe are worthy of further exploration. They then used AI tools to help create the websites.

## Features

- Interactive showcase of 6 math-related projects
- Thumbs-up voting system with IP-based tracking
- Each visitor can vote once per project
- Real-time vote count updates
- Beautiful parallax effects and animations

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### How the Voting System Works

- Each project card has a thumbs-up button
- Votes are tracked by IP address to prevent duplicate voting
- Once you vote for a project, the button becomes disabled and turns green
- Vote data is persisted in `votes.json` file
- The server automatically creates the votes file on first run

## API Endpoints

The voting system provides the following API endpoints:

- `GET /api/votes` - Get all vote counts
- `GET /api/votes/:projectId/check` - Check if current IP has voted for a project
- `POST /api/votes/:projectId` - Submit a vote for a project

## Project Structure

```
├── index.html          # Main webpage with voting UI
├── server.js           # Express server with voting API
├── package.json        # Node.js dependencies
├── votes.json          # Vote data (auto-generated)
└── README.md           # This file
```

## Development

To run in development mode:
```bash
npm run dev
```

## Notes

- Votes are stored in a JSON file (`votes.json`)
- IP addresses are stored to prevent duplicate voting
- The system uses CORS to allow cross-origin requests
- Vote data persists across server restarts

## License

MIT
