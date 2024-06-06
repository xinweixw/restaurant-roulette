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

app.get("/", (req, res) => {
    res.json("hello");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 