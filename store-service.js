/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: ______________________ 
Student ID: ______________ 
Date: ________________
Cyclic Web App URL: _______________________________________________________
GitHub Repository URL: ______________________________________________________

********************************************************************************/ 

const fs = require('fs');
const path = require('path');

// Global arrays to hold data
let items = [];
let categories = [];

// Function to initialize the module by reading the JSON files
function initialize() {
    return new Promise((resolve, reject) => {
        // Read items.json file
        fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read items.json file");
                return;
            }

            try {
                // Parse the JSON data and assign it to the items array
                items = JSON.parse(data);
            } catch (parseErr) {
                reject("Error parsing items.json");
                return;
            }

            // Read categories.json file only after items.json has been read successfully
            fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8', (err, data) => {
                if (err) {
                    reject("Unable to read categories.json file");
                    return;
                }

                try {
                    // Parse the JSON data and assign it to the categories array
                    categories = JSON.parse(data);
                } catch (parseErr) {
                    reject("Error parsing categories.json");
                    return;
                }

                // If both files were read and parsed successfully, resolve the promise
                resolve();
            });
        });
    });
}

// Function to get all items
function getAllItems() {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            reject("No results returned");
        } else {
            resolve(items);
        }
    });
}

// Function to get published items
function getPublishedItems() {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true);
        if (publishedItems.length === 0) {
            reject("No results returned");
        } else {
            resolve(publishedItems);
        }
    });
}

// Function to get all categories
function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            reject("No results returned");
        } else {
            resolve(categories);
        }
    });
}

// Export the functions as a module
module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories
};
