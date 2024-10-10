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


var items = [];
var categories = [];

// Function to initialize the module by reading the JSON files
const initialize = () => {
    return new Promise((resolve, reject) => {
        // Read items.json file
        const itemsPath = path.join(__dirname, 'data', 'items.json');
        const categoriesPath = path.join(__dirname, 'data', 'categories.json');
        fs.readFile(itemsPath, 'utf8', (err, itemsData) => {
            if (err) {
                reject("Unable to read items.json file");
                return;
            }

            try {
                // Parse the JSON data and assign it to the items array
                items = JSON.parse(itemsData);
            } catch (parseErr) {
                reject("Error parsing items.json");
                return;
            }

            // Read categories.json file only after items.json has been read successfully
            fs.readFile(categoriesPath, 'utf8', (err, categoriesData) => {
                if (err) {
                    reject("Unable to read categories.json file");
                    return;
                }

                try {
                    // Parse the JSON data and assign it to the categories array
                    categories = JSON.parse(categoriesData);
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
const getAllItems = () =>  {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            reject("No results returned");
        } else {
            resolve(items);
        }
    });
}

// Function to get published items
const getPublishedItems = () =>  {
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
const getCategories = () =>  {
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
    items,
    categories,
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories
};
