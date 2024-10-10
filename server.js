

/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Zena Mohamed
Student ID: 149696239
Date: 10/09/2024
Cyclic Web App URL: _______________________________________________________
GitHub Repository URL: https://github.com/zenamohamed/web322-app.git
********************************************************************************/ 

const path = require("path");
const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const fs = require('fs');
const storeService = require("./store-service");
const HTTP_PORT = process.env.PORT || 8080;

//absolute path so it works on vercel
app.use(express.static(__dirname + '/public'));

// Initialize the store-service and start the server
// then start the server on the port and output a confirmation to the console
storeService.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server running at http://localhost:${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.error(`Failed to initialize data: ${err}`);
    });

// static files
// app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.redirect("/about");
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html'));
});


app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).json({ message: err });
        });
});


app.get('/items', (req, res) => {
    storeService.getAllItems()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).json({ message: err });
        });
});


app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).json({ message: err });
        });
});


app.use((req, res) => {
    res.status(404).send('Page Not Found');
});


