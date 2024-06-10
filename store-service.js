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

module.exports = { initialize, getAllItems, getPublishedItems, getCategories };
