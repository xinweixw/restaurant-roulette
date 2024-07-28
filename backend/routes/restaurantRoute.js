const router = require('express').Router(); 
const supabase = require('../database'); 
const authorisation = require('../middleware/authorisation');

// Get all restaurants
router.get('/api/restaurants', async (req, res) => {
    try {
        const { data: restaurantData, error: restaurantError } = await supabase.from('restaurants_with_ratings')
            .select('*');
        
        if (restaurantError) throw restaurantError;

        res.status(200).json({
            status: "success",
            results: restaurantData.length,
            data: {
                restaurants: restaurantData,
            },
        })
    } catch (err) {
        console.error(err.message); 
        res.status(500).json("Server Error");
    }
}); 

// Get a restaurant
router.get('/api/restaurants/:id', async (req, res) => {
    try {
        const { data: oneRestaurant, error: restaurantError } = await supabase.from('restaurants_with_ratings')
            .select('*')
            .eq('rest_id', req.params.id);
        
        if (restaurantError) throw restaurantError;

        const { data: reviews, error: reviewsError } = await supabase.from('food_reviews').select('*').eq('rest_id', req.params.id); // remove with_names

        if (reviewsError) throw reviewsError;

        res.status(200).json({
            status: "success",
            data: {
                restaurant: oneRestaurant[0],
                reviews: reviews
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
}); 

// Add a food review
router.post('/api/restaurants/:id/review', authorisation, async (req, res) => {
    try {
        const { data: newReview, error } = await supabase.from('food_reviews')
        .insert({ user_id: req.user, rest_id: req.params.id, star: req.body.star, review: req.body.review, user_name: req.body.user_name})
        .select(); 
        
        if (error) throw error;
        
        res.status(201).json({
            status: "success",
            data: {
                review: newReview[0]
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
}); 

// Delete a food review
router.delete('/api/restaurants/:id/review/:reviewid', authorisation, async (req, res) => {
    try {
        // 1. Find the user who posted the review
        const { data: review_user } = await supabase.from('food_reviews')
        .select('*')
        .eq('review_id', req.params.reviewid);

        const reviewer = review_user[0].user_id;

        // console.log(reviewer);
        // console.log('User: ', req.user);

        // 2. Check if current user is the reviewer
        if (req.user !== reviewer) {
            return res.status(401).json("You cannot delete a review that is not yours");
        }

        // 3. If current user is the reviewer, delete the review
        const {data: deletedReview, error: reviewError } = await supabase.from('food_reviews')
        .delete()
        .eq('review_id', req.params.reviewid);

        if (reviewError) throw reviewError; 

        res.status(204).json({
            status: "success"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
}); 

// Update a food review
router.put('/api/restaurants/:id/review/:reviewid', authorisation, async (req, res) => {
    try {
        // 1. Find the user who posted the review
        const { data: review_user } = await supabase.from('food_reviews')
        .select('*')
        .eq('review_id', req.params.reviewid);

        const reviewer = review_user[0].user_id;

        // 2. Check if the current user is the reviewer
        if (req.user !== reviewer) {
            return res.status(401).json("You cannot delete a review that is not yours");
        }

        // 3. If the current user is the reviewer, update the review
        const { data: updatedReview, error: reviewError } = await supabase.from('food_reviews')
        .update({ star: req.body.star, review: req.body.review })
        .eq('review_id', req.params.reviewid)
        .select();

        if (reviewError) throw reviewError;

        res.status(200).json({
            status: "success",
            data: {
                review: updatedReview[0],
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Get a food review 
router.get('/api/restaurants/:id/review/:reviewid', authorisation, async (req, res) => {
    try {
        // 1. Find the user who posted the review
        const { data: review_user } = await supabase.from('food_reviews') // remove with_names
        .select('*')
        .eq('review_id', req.params.reviewid);

        const reviewer = review_user[0].user_id;

        // 2. Check if the current user is the reviewer
        if (req.user !== reviewer) {
            return res.status(401).json("You cannot delete a review that is not yours");
        }; 

        // 3. Get the review
        const { data: theReview, error: reviewError } = await supabase.from('food_reviews') // remove with_names
        .select('*')
        .eq('review_id', req.params.reviewid);

        if (reviewError) throw reviewError;

        res.status(200).json({
            status: "Success",
            data: {
                review: theReview[0],
            }
        }); 

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

// Get all food reviews of a restaurant
// router.get('/api/restaurants/:id/review', async (req, res) => {
//     try {
//         const { data: allReviews, error: reviewError } = await supabase.from('')
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json("Server Error");
//     }
// })

module.exports= router;