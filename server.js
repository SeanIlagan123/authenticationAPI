// https://dev.to/mr_cea/remaining-stateless-jwt-cookies-in-node-js-3lle
// Importing and executing Express
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
//Import Routes
const authRoute = require('./routes/auth');

dotenv.config();

// Database Connection
mongoose.connect(process.env.DB_CONNECTION,
{useNewUrlParser: true, useUnifiedTopology: true},
() => console.log('Connected to Database')
)

//Middleware
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(cookieParser());
app.use(express.json());


//Route Middlewares
app.use('/api/user', authRoute);

// Prevents errors when running and closing multiple times.
process.on("uncaughtException", () => server.close());
process.on("SIGTERM", () => server.close());

const port = 5000;

app.listen(port, () => console.log(`Running on port ${port}`));