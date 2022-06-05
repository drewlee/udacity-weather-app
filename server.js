'use strict';

// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Setup empty JS object to act as endpoint for all routes
const projectData = {};

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Application routes
app.post('/temp', (req, res) => {
  const { body } = req;

  Object.assign(projectData, body);
  res.send('Ok');
});

app.get('/all', (req, res) => {
  res.send(JSON.stringify(projectData));
});

// Setup Server
const port = 3000;

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
