const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Ensure you have this to load your .env file
const app = express();
const port = 8080;


// Folosește folderul "public" pentru fișiere statice (HTML, CSS, JS)
app.use(express.static('public'));

// Rutează pagina principală (index.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Endpoint pentru a obține datele vremii
app.get('/api/weather/:city', async (req, res) => {
    const city = req.params.city;
    const apiKey = process.env.API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await axios.get(weatherUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Endpoint pentru a obține cheia API
app.get('/api/getApiKey', (req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

// Pornește serverul pe portul 8080
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
