const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); 
const port = process.env.PORT; 

// Body parser middleware 
app.use(express.json());
app.use(cors());

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
app.use(require('./controllers/whatnew'));

// get all new restaurants
app.use(require('./routes/whatsnewRoute'));

// bite buddies
app.use(require('./routes/biteBuddiesRoute'));

// notifications 
app.use(require('./routes/notificationRoute'));

app.get("/", (req, res) => {
    res.json("hello");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 