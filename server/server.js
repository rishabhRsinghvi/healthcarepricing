const express = require('express');
const cors = require('cors');
const axios = require('axios');
const serviceRoutes = require('./routes/serviceRoutes'); // If you still need other routes
const authRoutes = require('./routes/authRoutes'); // If you still need other routes
const discussionRoutes = require('./routes/discussionRoutes'); // If you still need other routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub configuration
const GITHUB_TOKEN = 'github_token'; // Replace with your token
const REPO_OWNER = 'rishabhRsinghvi'; // Replace with your GitHub username
const REPO_NAME = 'healthcare-pricing'; // Your repository name
const FILE_PATH = 'data/services.json'; // Path to your JSON file

// Get JSON data from GitHub
const getDataFromGitHub = async () => {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const response = await axios.get(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return JSON.parse(content);
};

// Update JSON data on GitHub
const updateDataOnGitHub = async (newData) => {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const currentData = await getDataFromGitHub();

    // Add the new service data to the existing array
    currentData.push(newData);

    const response = await axios.get(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    await axios.put(url, {
        message: 'Update services.json',
        content: Buffer.from(JSON.stringify(currentData, null, 2)).toString('base64'),
        sha: response.data.sha // SHA of the existing file
    }, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
};

// Routes for GitHub services
app.get('/api/services', async (req, res) => {
    try {
        const services = await getDataFromGitHub();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/services', async (req, res) => {
    try {
        const newService = req.body;
        await updateDataOnGitHub(newService);
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Other routes (if still needed)
app.use('/api/auth', authRoutes);
app.use('/api/discussions', discussionRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});