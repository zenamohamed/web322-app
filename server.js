/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Larry Okuonghae Student ID: 145203238 Date: 07/05/2024
*
*  Vercel Web App URL: https://web322-app-nu.vercel.app
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

cloudinary.config({
   cloud_name: 'dds0nbuc4',
   api_key: '598547286389728',
   api_secret: 'NY-ixOgeXCzolmOHkomP0MCVXoQ',
   secure: true
});

const upload = multer(); // no { storage: storage } since we are not using disk storage

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
   if (req.query.category) {
       storeService.getItemsByCategory(req.query.category).then((items) => {
           res.json(items);
       }).catch((err) => {
           res.status(404).send(err);
       });
   } else if (req.query.minDate) {
       storeService.getItemsByMinDate(req.query.minDate).then((items) => {
           res.json(items);
       }).catch((err) => {
           res.status(404).send(err);
       });
   } else {
       storeService.getAllItems().then((items) => {
           res.json(items);
       }).catch((err) => {
           res.status(404).send(err);
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
       .then(data => res.json(data))
       .catch(err => res.status(500).json({ message: err }));
});

//Serve the addItem.html file
app.get('/items/add', (req, res) => {
   res.sendFile(path.join(__dirname, '/views/addItem.html'));
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