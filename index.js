const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public')); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());  


const PRIVATE_APP_ACCESS = process.env.HUBSPOT_PRIVATE_APP_ACCESS_TOKEN || '';

// ROUTE 1 - Fetch custom object data and render homepage
app.get('/', async (req, res) => {
    const customObjectsUrl = 'https://api.hubapi.com/crm/v3/objects/2-36517265'; // URL to fetch custom objects
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // Fetch data from HubSpot API
        const response = await axios.get(customObjectsUrl, { headers });
        const data = response.data.results;

        // Render the homepage with the custom object data
        res.render('homepage', { title: 'Custom Object List', records: data });
    } catch (error) {
        console.error("Error retrieving records:", error);
        res.status(500).send('Error retrieving records');
    }
});

// ROUTE 2 - Render the form to create or update custom object data
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - Handle form submission to create or update custom object data
app.post('/update-cobj', async (req, res) => {
    const newRecord = {
        properties: {
            property1: req.body.dino_name, // Custom field 1
            property2: req.body.dino_paddock, // Custom field 2
            property3: req.body.dino_dietary_type  // Custom field 3
        }
    };
    
    const customObjectUrl = 'https://api.hubapi.com/crm/v3/objects/2-36517265'; // API URL for custom objects
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // POST request to HubSpot to create the custom object
        await axios.post(customObjectUrl, newRecord, { headers });

        // Redirect the user back to the homepage
        res.redirect('/');
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(500).send('Error creating record');
    }
});

// Localhost server setup
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
