const path = require('path');
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const storeService = require('./store-service');
const HTTP_PORT = process.env.PORT || 8080; // assign a port

// start the server on the port and output a confirmation to the console
//app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

app.use(express.static('public'));

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