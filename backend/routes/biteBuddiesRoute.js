const router = require('express').Router(); 
const supabase = require('../database'); 
const authorisation = require('../middleware/authorisation');

router.get('/api/bitebuddies/price', async (req, res) => {
    try {
        const { data, error } = await supabase.from('distinct_prices')
        .select('rest_price');

        if (error) throw error;

        res.status(200).json({
            status: "success",
            data: data
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

router.get('/api/bitebuddies/location', async (req, res) => {
    try {
        const { data, error } = await supabase.from('distinct_locations')
        .select('rest_location');

        if (error) throw error;

        res.status(200).json({
            status: "success",
            data: data
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

router.get('/api/bitebuddies/cuisine', async (req, res) => {
    try {
        const { data, error } = await supabase.from('distinct_cuisines')
        .select('cuisine');

        if (error) throw error;

        res.status(200).json({
            status: "success",
            data: data
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;
