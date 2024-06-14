/*********************************************************************************
WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Larry Okuonghae
Student ID: 145203238
Date: 06-09-2024
Vercel Web App URL: https://web322-app-nu.vercel.app
GitHub Repository URL: https://github.com/Elo07/web322-app.git

********************************************************************************/ 

const path = require('path');
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const storeService = require('./store-service');

// absolute path to css so it works on vercel
app.use(express.static(__dirname + '/public'));

// Redirect root to /about
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Serve the about.html file
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

// Route to get all published items
app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
       .then(data => res.json(data))
       .catch(err => res.status(500).json({ message: err }));
 });
 
 // Route to get all items
 app.get('/items', (req, res) => {
    storeService.getAllItems()
       .then(data => res.json(data))
       .catch(err => res.status(500).json({ message: err }));
 });
 
 // Route to get all categories
 app.get('/categories', (req, res) => {
    storeService.getCategories()
       .then(data => res.json(data))
       .catch(err => res.status(500).json({ message: err }));
 });
 
 // Handle 404 - Page Not Found
 app.use((req, res) => {
    res.status(404).send('Page Not Found');
 });
 
 // Initialize store-service and start the server
 storeService.initialize()
    .then(() => {
       const PORT = process.env.PORT || 8080;
       app.listen(PORT, () => {
          console.log(`Express http server listening on port ${PORT}`);
       });
    })
    .catch(err => {
       console.error(`Failed to initialize data: ${err}`);
    });