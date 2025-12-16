const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all origins for now, or restrict to GitHub Pages domain in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Exchange Token Endpoint
app.post('/exchange-token', async (req, res) => {
    const { code, app_key, secret, redirect_uri } = req.body;

    if (!code || !app_key || !secret || !redirect_uri) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const params = new URLSearchParams();
        params.append('client_key', app_key);
        params.append('client_secret', secret);
        params.append('code', code);
        params.append('grant_type', 'authorization_code');
        params.append('redirect_uri', redirect_uri);

        const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // TikTok returns: { access_token, expires_in, open_id, refresh_token, ... } unless error
        if (response.data.error) {
            return res.status(400).json(response.data);
        }

        res.json(response.data);
    } catch (error) {
        console.error('Token Exchange Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to exchange token', details: error.response?.data });
    }
});

// 2. User Info Endpoint
app.post('/user-info', async (req, res) => {
    const { access_token } = req.body;

    if (!access_token) {
        return res.status(400).json({ error: 'Missing access_token' });
    }

    try {
        // Fetch specific fields
        const fields = 'open_id,union_id,avatar_url,display_name,username';
        const response = await axios.get(`https://open.tiktokapis.com/v2/user/info/?fields=${fields}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('User Info Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch user info', details: error.response?.data });
    }
});

// 3. Video List Endpoint
app.post('/video-list', async (req, res) => {
    const { access_token } = req.body;

    if (!access_token) {
        return res.status(400).json({ error: 'Missing access_token' });
    }

    try {
        const response = await axios.post('https://open.tiktokapis.com/v2/video/list/',
            {
                // You can add filters here like max_count, cursor etc if needed. 
                // Empty body gets default list.
            },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Video List Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch video list', details: error.response?.data });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send('TikTok API Backend is running.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
