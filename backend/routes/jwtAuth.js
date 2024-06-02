const router = require('express').Router(); 
const pool = require('../database'); 
const bcrypt = require('bcrypt'); 
const createJWT = require('../utils/createJWT'); 
const validInfo = require('../middleware/validInfo'); 
const authorisation = require('../middleware/authorisation'); 

// registering
router.post('/register', validInfo, async (req, res) => {
    try {
        // 1. destructure the req.body (name, email, password)
        const { name, email, password } = req.body; 

        // 2. check if user exists (email is unique)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]); 

        if (user.rows.length !== 0) {
            return res.status(401).json("User already exists"); 
        }; 

        // 3. Bcrypt the user's password 
        const saltRound = 10; 
        const salt = await bcrypt.genSalt(saltRound); 

        const bcryptPassword = await bcrypt.hash(password, salt); // password is from step 1

        // 4. enter the new user into the database
        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [
            name, email, bcryptPassword
        ]); // name and email from step 1, bcryptPassword from step 3

        // 5. creating the jwt token 
        const token = createJWT(newUser.rows[0].user_id); 
        res.json({ token }); 

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
}); 

// login 
router.post('/login', validInfo, async (req, res) => {
    try {
        // 1. destructure the req.body 
        const { email, password } = req.body; 

        // 2. check if user does not exist
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]); 

        if (user.rows.length === 0) {
            return res.status(401).json("Password or Email is incorrect"); 
        }; 

        // 3. check if password is correct 
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password); 

        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect"); 
        }; 

        // 4. give the jwt token 
        const token = createJWT(user.rows[0].user_id); 
        res.json({ token }); 

    } catch (err) {
        console.error(err.message); 
        res.status(500).json("Server Error"); 
    }
}); 

// verify
router.get("/verify", authorisation, async (req, res) => {
    try {
        res.json(true); 
    } catch (err) {
        console.error(err.message); 
        res.status(500).json("Server Error"); 
    }
}); 

module.exports = router; 