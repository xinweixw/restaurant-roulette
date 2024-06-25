const router = require('express').Router(); 
const supabase = require('../database'); 
const authorisation = require('../middleware/authorisation');

// Get quiz questions
router.get('/api/quiz', async (req, res) => {
    try {
        // 1. Get random questions's questions
        const { data: randomQuesData, error: randomQuesError } = await supabase.from('random_order_of_questions')
        .select('*')
        .limit(3);

        if (randomQuesError) throw randomQuesError;

        // 2. Get the random questions' options
        const qIds = randomQuesData.map(q => q.question_num); 
        const { data: randomOptionsData, error: randomOptError } = await supabase.from('options')
        .select('*')
        .in('question_num', qIds);

        if (randomOptError) throw (randomOptError);

        // 3. Combine the question and options
        const wholeQuestion = randomQuesData.map(q => ({
            q_id: q.question_num,
            qns: q.question,
            options: randomOptionsData.filter(opt => opt.question_num === q.question_num)
        }));

        // 4. Add the compulsory questions
        // 4a. Get the compulsory questions
        const compulsoryQuestions = [
            {q_id: -1, qns: "Do you have any dietary restrictions?", options: [{opt: "None", points: 0}, {opt: "Vegetarian", points: 0}, {opt: "Halal", points: 0}, {opt: "Halal, Vegetarian", points: 0}] },
            {q_id: -2, qns: "What is your preferred price range?", options: [{opt: "$", points: 0}, {opt: "$$", points: 0}, {opt: "$$$", points: 0}, {opt: "$$$$", points: 0}] }
        ];

        // 4b. Combine the compulsory questions with the random questions
        const questions = [...compulsoryQuestions, ...wholeQuestion];
        res.status(200).json({
            status: "success",
            data: questions
        }); 
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
}); 

// Post quiz answers
router.post('/api/quiz/submit', async (req, res) => {
    try {
        // 1. Get the answers from req.body
        const { answer } = req.body;
        const dietRestriction = answer[0];
        const preferredPrice = answer[1]; 

        // 2. Calculate score for the random questions
        let score = 0; 
        for (let i = 2; i < answer.length; i++) {
            score = score + answer[i];
        }

        // 3. Filter the restaurants by answers to the compulsory questions
        if (dietRestriction[0] === 'None'){
            const { data: restaurantsData, error: restaurantsError } = await supabase.from('restaurants_with_ratings')
                .select('*')
                .eq('rest_price', preferredPrice);

            if (restaurantsError) throw restaurantsError;
            
            // 4. Find the recommended restaurant
            const numRestaurants = restaurantsData.length;
            const maxScore = 171;
            const minScore = 12;
            const restaurantScoreInterval = (maxScore - minScore) / numRestaurants;

            const recIndex = Math.ceil(score / restaurantScoreInterval);
            const rec = restaurantsData[recIndex];
            res.status(200).json({
                status: "success",
                data: rec
             });

        } else {
            const { data: restaurantsData, error: restaurantsError } = await supabase.from('restaurants_with_ratings')
                .select('*')
                .like('special_conditions', `%${dietRestriction}%`)
                .eq('rest_price', preferredPrice);

            if (restaurantsError) throw restaurantsError;

            // 4. Find the recommended restaurant
            const numRestaurants = restaurantsData.length;
            const maxScore = 171;
            const minScore = 12;
            const restaurantScoreInterval = (maxScore - minScore) / numRestaurants;

            const recIndex = Math.ceil(score / restaurantScoreInterval);
            const rec = restaurantsData[recIndex - 1];
            res.status(200).json({
                status: "success",
                data: rec
            });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;