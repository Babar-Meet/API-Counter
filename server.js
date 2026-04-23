const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Load or initialize data
let apiConfig = {
    endpoints: []
};

if (fs.existsSync(DATA_FILE)) {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        apiConfig = JSON.parse(data);
    } catch (e) {
        console.error('Error reading data file:', e);
    }
}

function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(apiConfig, null, 2));
}

// MANAGEMENT API
app.get('/management/apis', (req, res) => {
    res.json(apiConfig.endpoints);
});

app.post('/management/apis', (req, res) => {
    const { path } = req.body;
    if (!path) return res.status(400).json({ error: 'Path is required' });

    // Ensure path starts with /
    const formattedPath = path.startsWith('/') ? path : `/${path}`;

    if (apiConfig.endpoints.find(e => e.path === formattedPath)) {
        return res.status(400).json({ error: 'Endpoint already exists' });
    }

    const newEndpoint = {
        id: Date.now().toString(),
        path: formattedPath,
        count: 0,
        createdAt: new Date().toISOString()
    };

    apiConfig.endpoints.push(newEndpoint);
    saveData();
    res.status(201).json(newEndpoint);
});

app.delete('/management/apis/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete API with ID: ${id}`);
    const initialLength = apiConfig.endpoints.length;
    apiConfig.endpoints = apiConfig.endpoints.filter(e => e.id !== id);
    
    if (apiConfig.endpoints.length === initialLength) {
        console.log(`API with ID ${id} not found.`);
        return res.status(404).json({ error: 'Endpoint not found' });
    }

    saveData();
    console.log(`API with ID ${id} deleted successfully.`);
    res.json({ message: 'Deleted successfully' });
});

app.post('/management/apis/:id/reset', (req, res) => {
    const { id } = req.params;
    const endpoint = apiConfig.endpoints.find(e => e.id === id);
    
    if (!endpoint) {
        return res.status(404).json({ error: 'Endpoint not found' });
    }

    endpoint.count = 0;
    saveData();
    res.json(endpoint);
});

app.post('/management/apis/reset-all', (req, res) => {
    apiConfig.endpoints.forEach(e => e.count = 0);
    saveData();
    res.json({ message: 'All counts reset' });
});

// DYNAMIC API HANDLER (CATCH-ALL)
app.use((req, res, next) => {
    // Exclude management and static files if they somehow reached here
    if (req.path.startsWith('/management')) return next();

    const endpoint = apiConfig.endpoints.find(e => e.path === req.path);
    if (endpoint) {
        endpoint.count++;
        saveData();
        return res.json({
            message: `Mock response for ${req.path}`,
            count: endpoint.count,
            timestamp: new Date().toISOString()
        });
    }
    
    // If not a registered endpoint, for regular browser requests, maybe we don't do anything or return 404
    next();
});

app.listen(PORT, () => {
    console.log(`API Counter Server running at http://localhost:${PORT}`);
});
