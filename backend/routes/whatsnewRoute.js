const router = require('express').Router(); 
const supabase = require('../database'); 
const authorisation = require('../middleware/authorisation');

// Get all new restaurants
router.get('/api/whatsnew', authorisation, async (req, res) => {
    try {
        const { data: newRestaurants, error: newRestaurantsError } = await supabase.from('restaurants_with_ratings')
        .select('*')
        .eq('is_new', true);

        if (newRestaurantsError) throw newRestaurantsError;

        res.status(200).json({
            status: "success",
            data: {
                newRestaurants: newRestaurants,
            },
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router; 