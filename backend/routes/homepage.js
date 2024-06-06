const router = require('express').Router(); 
const supabase = require('../database'); 
const authorisation = require('../middleware/authorisation'); 

router.get('/', authorisation, async (req, res) => {
    try {
        const { data: user } = await supabase.from('users').select('user_name').eq('user_id', req.user);
        // req.user is a custom key of req object => in this case it's from createJWT req.body 
        res.json(user[0]); 
    } catch (err) {
        console.error(err.message); 
        res.status(500).json("Server Error"); 
    }
}); 

module.exports = router; 