const router = require('express').Router(); 
const supabase = require('../database'); 
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
        const { data: existingUser } = await supabase.from('users').select('*').eq('user_email', email);

        if (existingUser.length !== 0) {
            return res.status(401).json("User already exists");
        }

        // 3. Bcrypt the user's password 
        const saltRound = 10; 
        const salt = await bcrypt.genSalt(saltRound); 

        const bcryptPassword = await bcrypt.hash(password, salt); // password is from step 1

        // 4. enter the new user into the database
        const { data: newUser } = await supabase.from('users').insert([
            { user_name: name, user_email: email, user_password: bcryptPassword }
        ]).select('*'); // name and email from step 1, bcryptPassword from step 3
        
        // const newUser = data[0];

        // 5. creating the jwt token 
        const token = createJWT(newUser[0].user_id); 
        res.status(201).json({ token }); 

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
        const { data: existingUser} = await supabase.from('users').select('*').eq('user_email', email);

        if (existingUser.length === 0) {
            return res.status(401).json("Password or Email is incorrect");
        }

        // 3. check if password is correct 
        const validPassword = await bcrypt.compare(password, existingUser[0].user_password); 

        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect"); 
        }; 

        // 4. give the jwt token 
        const token = createJWT(existingUser[0].user_id); 
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