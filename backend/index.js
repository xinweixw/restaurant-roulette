const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); 
const port = process.env.PORT || 5000;

// Body parser middleware 
app.use(express.json());
app.use(cors());

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:5173',  // Replace with your frontend URL
    credentials: true,  // Required to allow cookies and authorization headers
};
app.use(cors(corsOptions));


// Routes 

// register and login 
app.use('/auth', require('./routes/jwtAuth'));

// homepage 
app.use('/homepage', require('./routes/homepage'));

// errorHandler
app.use(require('./middleware/errorHandler'));

// get all restaurants, get a restaurant, add a food review, delete a food review
app.use(require('./routes/restaurantRoute')); 

// random restaurant generator quiz
app.use(require('./routes/randomQuizRoute'));

// get all folders
app.use(require('./routes/favouriteRoute'));

// get automated web scraping
app.use('/whatnewcron', require('./controllers/whatnew'));

// get all new restaurants
app.use(require('./routes/whatsnewRoute'));

// bite buddies
app.use('/bite-buddies', require('./routes/groupRoutes'));

app.get("/", (req, res) => {
    res.json("hello");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 