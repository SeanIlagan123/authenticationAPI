// Importing and executing Express
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const passport = require('passport');
require('dotenv/config');

//Import Routes
const usersRoute = require('./routes/users');

//Middlewares
app.use(cors());
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());

// Database config 
const db = require("./config/keys").mongoURI;

// Connect to Database
mongoose.connect(
    db,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log('Connected to Database')
);

// Passport Middleware and config
app.use(passport.initialize());
require("./config/passport")(passport);

app.use('/users', usersRoute);


// Prevents errors when running and closing multiple times.
process.on("uncaughtException", () => server.close());
process.on("SIGTERM", () => server.close());

const port = 5000;

app.listen(port, () => console.log(`Running on port ${port}`));