//Importing Modules

const express = require('express'); //add express
const mongoose = require('mongoose'); //An Object Data Modeling library for MongoDB
const cors = require('cors'); //middleware allows requests from different origins
const dotenv = require('dotenv'); //loads environment variables from a .env file
const openaiRoutes = require('./routes/openaiRoutes');
const Note = require('./models/noteModel');
const { auth } = require('express-openid-connect');


dotenv.config();  //Load variables from .env file into process.env

const app = express(); //Initialize express application

//Middleware for handling JSON requests
app.use(express.json()); //Allows server to parse JSON data in request bodies
app.use(cors()); //Enable CORS for all routes
app.use('/api/openai', openaiRoutes);

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET_KEY,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};


app.use(auth(config));

const { requiresAuth } = require('express-openid-connect');

// Route that requires authentication
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


//Connect to MongoDB through the connection string stored in process.env.MONGO_URI
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, //Use URL string parser
    useUnifiedTopology: true, //Use topology engine for performance and error handling
});

// Get a reference to the mongoose connection object
const db = mongoose.connection;

// Set up an event listener for when an error occurs during the database connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Start the server and listen for incoming requests on the specified port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});