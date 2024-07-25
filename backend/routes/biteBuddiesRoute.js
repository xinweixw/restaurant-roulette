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

// get all user groups
router.get('/api/bitebuddies/groups', authorisation, async (req, res) => {
    try {
        const { data: chatsIdsData, error: chatsIdsError } = await supabase.from('chat_users')
        .select('chat_id')
        .eq('user_id', req.user);

        if (chatsIdsError) throw chatsIdsError;

        const allChatIds = chatsIdsData.flatMap((chatId) => Object.keys(chatId).map((key) => chatId[key]));

        const { data: chatsInfo, error: chatsInfoError } = await supabase.from('chats')
        .select('*')
        .in('chat_id', allChatIds);

        if (chatsInfoError) throw chatsInfoError;

        res.status(200).json({
            status: "success",
            data: chatsInfo
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

module.exports = router;