const fs = require('fs').promises;
const path = require('path');

let items = [];
let categories = [];

const initialize = async () => {
   try {
      // Read items.json file
      const itemsData = await fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8');
      items = JSON.parse(itemsData);

      // Read categories.json file
      const categoriesData = await fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8');
      categories = JSON.parse(categoriesData);

      console.log('Data initialized successfully');
   } catch (err) {
      console.error('Failed to initialize data:', err);
      throw err; // Re-throw the error to indicate initialization failure
   }
};

const getAllItems = () => {
   if (items.length > 0) {
      return Promise.resolve(items);
   } else {
      return Promise.reject('No items available');
   }
};

const getPublishedItems = () => {
   const publishedItems = items.filter(item => item.published === true);
   if (publishedItems.length > 0) {
      return Promise.resolve(publishedItems);
   } else {
      return Promise.reject('No published items available');
   }
};

const getCategories = () => {
   if (categories.length > 0) {
      return Promise.resolve(categories);
   } else {
      return Promise.reject('No categories available');
   }
};

// Function to add a new item
const addItem = (itemData) => {
   return new Promise((resolve, reject) => {
       if (itemData.published === undefined) {
           itemData.published = false;
       } else {
           itemData.published = true;
       }
       itemData.id = items.length + 1;
       itemData.postDate = new Date().toISOString().split('T')[0]; // Set the itemDate to the current date
       items.push(itemData);
       resolve(itemData);
   });
};

// Function to get items by category
const getItemsByCategory = (category) => {
   return new Promise((resolve, reject) => {
       const itemsByCategory = items.filter(item => item.category == category);
       if (itemsByCategory.length > 0) {
           resolve(itemsByCategory);
       } else {
           reject('No items found for the specified category');
       }
   });
};

// Function to get published items by category
const getPublishedItemsByCategory = (category) => {
   return new Promise((resolve, reject) => {
       const publishedItemsByCategory = items.filter(item => item.published == true && item.category == category);
       if (publishedItemsByCategory.length > 0) {
           resolve(publishedItemsByCategory);
       } else {
           reject('No published items found for the specified category');
       }
   });
};

// Function to get items by minimum date
const getItemsByMinDate = (minDateStr) => {
   return new Promise((resolve, reject) => {
       const minDate = new Date(minDateStr);
       const itemsByMinDate = items.filter(item => new Date(item.postDate) >= minDate);
       if (itemsByMinDate.length > 0) {
           resolve(itemsByMinDate);
       } else {
           reject('No items found for the specified date');
       }
   });
};

// Function to get an item by ID
const getItemById = (id) => {
   return new Promise((resolve, reject) => {
       const item = items.find(item => item.id == id);
       if (item) {
           resolve(item);
       } else {
           reject('No item found with the specified ID');
       }
   });
};

module.exports = { initialize, getAllItems, getPublishedItems, getCategories, addItem, getItemsByCategory, getItemsByMinDate, getItemById, getPublishedItemsByCategory };
