const express = require('express');
const path = require('path');
const schedule = require('node-schedule');

const app = express();

let latestQuote = null;
let check = 0;
// Schedule a job to fetch quotes every 2 mins and store the result in `latestQuote`
schedule.scheduleJob('*/2 * * * * ', async () => {
  const url = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c9d6fed173mshc26d86abfb8fc64p1f6468jsncf989f5a201f',
      'x-rapidapi-host': 'quotes15.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);

    latestQuote = await response.json(); // Update the latest quote
    console.log('New quote fetched:', latestQuote);
    check +=1;
    console.log(check); 
  } catch (error) {
    console.error('Error fetching quote:', error);
  }
});

// Serve the static HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to fetch the latest quote
app.get('/api/data', (req, res) => {
  if (!(latestQuote === null)) {
    res.json(latestQuote);
  } else {
    res.status(503).json({ error: 'No quote available yet. Try again later.' });
  }
});

// Start the server
app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
