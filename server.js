/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Larry Okuonghae Student ID: 145203238 Date: 07/16/2024
*
*  Vercel Web App URL: https://web322-app-six-umber.vercel.app/
* 
*  GitHub Repository URL: https://github.com/Elo07/web322-app.git
*
********************************************************************************/ 

const path = require('path');
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const storeService = require('./store-service');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const exphbs = require('express-handlebars');

// Handlebars helpers
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active"' : '') + '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

cloudinary.config({
   cloud_name: 'dds0nbuc4',
   api_key: '598547286389728',
   api_secret: 'NY-ixOgeXCzolmOHkomP0MCVXoQ',
   secure: true
});

const upload = multer(); // no { storage: storage } since we are not using disk storage

// absolute path to css so it works on vercel
app.use(express.static(__dirname + '/public'));

// Redirect root to /shop
app.get('/', (req, res) => {
    res.redirect('/shop');
});

// Serve the about.html file
app.get('/about', (req, res) => {
    res.render('about');
});

// Route to get all published items
app.get("/shop", async (req, res) => {
    // Declare an object to store properties for the view
    let viewData = {};
  
    try {
      // declare empty array to hold "item" objects
      let items = [];
  
      // if there's a "category" query, filter the returned items by category
      if (req.query.category) {
        // Obtain the published "item" by category
        items = await storeService.getPublishedItemsByCategory(req.query.category);
      } else {
        // Obtain the published "items"
        items = await storeService.getPublishedItems();
      }
  
      // sort the published items by itemDate
      items.sort((a, b) => new Date(b.itemDate) - new Date(a.itemDate));
  
      // get the latest item from the front of the list (element 0)
      let item = items[0];
  
      // store the "items" and "item" data in the viewData object (to be passed to the view)
      viewData.items = items;
      viewData.item = item;
    } catch (err) {
      viewData.message = "no results";
    }
  
    try {
      // Obtain the full list of "categories"
      let categories = await storeService.getCategories();
  
      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
    } catch (err) {
      viewData.categoriesMessage = "no results";
    }
  
    // render the "shop" view with all of the data (viewData)
    res.render("shop", { data: viewData });
  });


app.get('/shop/:id', async (req, res) => {

// Declare an object to store properties for the view
let viewData = {};
  
try{
  
    // declare empty array to hold "item" objects
    let items = [];
  
    // if there's a "category" query, filter the returned items by category
    if(req.query.category){
        // Obtain the published "items" by category
        items = await itemData.getPublishedItemsByCategory(req.query.category);
    }else{
        // Obtain the published "items"
        items = await itemData.getPublishedItems();
    }
  
    // sort the published items by itemDate
    items.sort((a,b) => new Date(b.itemDate) - new Date(a.itemDate));
  
    // store the "items" and "item" data in the viewData object (to be passed to the view)
    viewData.items = items;
  
    }catch(err){
        viewData.message = "no results";
    }
  
    try{
        // Obtain the item by "id"
        viewData.item = await itemData.getItemById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }
  
    try{
        // Obtain the full list of "categories"
        let categories = await itemData.getCategories();
  
        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }
  
// render the "shop" view with all of the data (viewData)
res.render("shop", {data: viewData})
});
 
// Route to get all items
app.get('/items', (req, res) => {
    if (req.query.category) {
        storeService.getItemsByCategory(req.query.category).then((items) => {
            if (items.length > 0) {
                res.render('items', { items: items });
            } else {
                res.render('items', { message: "No items found" });
            }
        }).catch((err) => {
            res.render('items', { message: "No results" });
        });
    } else if (req.query.minDate) {
        storeService.getItemsByMinDate(req.query.minDate).then((items) => {
            if (items.length > 0) {
                res.render('items', { items: items });
            } else {
                res.render('items', { message: "No items found" });
            }
        }).catch((err) => {
            res.render('items', { message: "No results" });
        });
    } else {
        storeService.getAllItems().then((items) => {
            if (items.length > 0) {
                res.render('items', { items: items });
            } else {
                res.render('items', { message: "No items found" });
            }
        }).catch((err) => {
            res.render('items', { message: "No results" });
        });
    }
});

app.get('/item/:id', (req, res) => {
   storeService.getItemById(req.params.id).then((item) => {
       res.json(item);
   }).catch((err) => {
       res.status(404).send(err);
   });
});
 
// Route to get all categories
app.get('/categories', (req, res) => {
   storeService.getCategories()
       .then((data) =>{ 
            res.render('categories', { categories: data });
        })
       .catch((err) =>{ 
        res.render('categories', { message: "No categories found" });
       })
});

//Serve the addItem.html file
app.get('/items/add', (req, res) => {
   res.render('addItem');
});

app.post('/items/add', upload.single('featureImage'), (req, res) => {
   if (req.file) {
       let streamUpload = (req) => {
           return new Promise((resolve, reject) => {
               let stream = cloudinary.uploader.upload_stream(
                   (error, result) => {
                       if (result) {
                           resolve(result);
                       } else {
                           reject(error);
                       }
                   }
               );

               streamifier.createReadStream(req.file.buffer).pipe(stream);
           });
       };

       async function upload(req) {
           let result = await streamUpload(req);
           console.log(result);
           return result;
       }

       upload(req).then((uploaded) => {
           processItem(uploaded.url);
       });
   } else {
       processItem("");
   }

   function processItem(imageUrl) {
      req.body.featureImage = imageUrl;
      // TODO: Process the req.body and add it as a new Item before redirecting to /items
      storeService.addItem(req.body).then((item) => {
          res.redirect('/items');
      }).catch((err) => {
          res.status(500).send(err.message);
      });
  }
});

 
// Handle 404 - Page Not Found
app.use((req, res) => {
   res.status(404).render('404');
});
 

// Initialize store-service and start the server
storeService.initialize()
   .then(() => {
      const PORT = process.env.PORT || 8080;
      app.listen(PORT, () => {
         console.log(`Express http server listening on port ${PORT}`);
         console.log(`Server is running at http://localhost:${PORT}`);
      });
   })
   .catch(err => {
      console.error(`Failed to initialize data: ${err}`);
   });