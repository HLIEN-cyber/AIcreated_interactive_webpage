const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const VOTES_FILE = path.join(__dirname, 'votes.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize votes file if it doesn't exist
async function initVotesFile() {
    try {
        await fs.access(VOTES_FILE);
    } catch {
        const initialData = {
            projects: {
                '1': { count: 0, voters: [] },
                '2': { count: 0, voters: [] },
                '3': { count: 0, voters: [] },
                '4': { count: 0, voters: [] },
                '5': { count: 0, voters: [] },
                '6': { count: 0, voters: [] }
            }
        };
        await fs.writeFile(VOTES_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Get client IP address
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'] ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress;
}

// Read votes from file
async function readVotes() {
    const data = await fs.readFile(VOTES_FILE, 'utf8');
    return JSON.parse(data);
}

// Write votes to file
async function writeVotes(data) {
    await fs.writeFile(VOTES_FILE, JSON.stringify(data, null, 2));
}

// Get all votes
app.get('/api/votes', async (req, res) => {
    try {
        const data = await readVotes();
        const voteCounts = {};

        for (const [projectId, projectData] of Object.entries(data.projects)) {
            voteCounts[projectId] = projectData.count;
        }

        res.json({ success: true, votes: voteCounts });
    } catch (error) {
        console.error('Error reading votes:', error);
        res.status(500).json({ success: false, error: 'Failed to read votes' });
    }
});

// Check if user has voted for a specific project
app.get('/api/votes/:projectId/check', async (req, res) => {
    try {
        const { projectId } = req.params;
        const clientIP = getClientIP(req);
        const data = await readVotes();

        if (!data.projects[projectId]) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        const hasVoted = data.projects[projectId].voters.includes(clientIP);

        res.json({
            success: true,
            hasVoted,
            count: data.projects[projectId].count
        });
    } catch (error) {
        console.error('Error checking vote:', error);
        res.status(500).json({ success: false, error: 'Failed to check vote' });
    }
});

// Submit a vote
app.post('/api/votes/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const clientIP = getClientIP(req);
        const data = await readVotes();

        if (!data.projects[projectId]) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }

        // Check if IP has already voted
        if (data.projects[projectId].voters.includes(clientIP)) {
            return res.status(400).json({
                success: false,
                error: 'You have already voted for this project',
                count: data.projects[projectId].count
            });
        }

        // Add vote
        data.projects[projectId].voters.push(clientIP);
        data.projects[projectId].count += 1;

        await writeVotes(data);

        res.json({
            success: true,
            count: data.projects[projectId].count,
            message: 'Vote recorded successfully'
        });
    } catch (error) {
        console.error('Error submitting vote:', error);
        res.status(500).json({ success: false, error: 'Failed to submit vote' });
    }
});

// Start server
async function startServer() {
    await initVotesFile();
    app.listen(PORT, () => {
        console.log(`Voting server running on http://localhost:${PORT}`);
        console.log(`API endpoints:`);
        console.log(`  GET  /api/votes - Get all vote counts`);
        console.log(`  GET  /api/votes/:projectId/check - Check if IP has voted`);
        console.log(`  POST /api/votes/:projectId - Submit a vote`);
    });
}

startServer();
