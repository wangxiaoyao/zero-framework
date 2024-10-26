const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
// const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); 

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://apiok.us/api/cbea';

// API 路由
app.get('/api/generate-email', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/generate/v1`, {
            params: { apikey: API_KEY, type: '*' }
        });
        console.log('API Response:内部API:', response.data);
        console.log(API_KEY,'API_KEY test');
        // 直接将完整的 API 响应发送给前端
        res.json(response.data);
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate email' });
    }
});

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
module.exports = app;