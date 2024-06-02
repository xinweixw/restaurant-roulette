const router = require('express').Router(); 
const pool = require('../database'); 
const authorisation = require('../middleware/authorisation'); 

router.get('/', authorisation, async (req, res) => {
    try {
        const user = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [req.user]); 
        // req.user is a custom key of req object => in this case it's from createJWT req.body 
        res.json(user.rows[0]); 
    } catch (err) {
        console.error(err.message); 
        res.status(500).json("Server Error"); 
    }
}); 

module.exports = router; 