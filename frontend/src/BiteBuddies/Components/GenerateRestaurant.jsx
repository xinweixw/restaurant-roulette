import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../FoodSearch/config/SupabaseClient';
import { toast } from 'react-toastify';
import Loading from '../../assets/Loading';
import { ResultRestaurant } from '../../FoodSearch/components/ResultRestaurant';
import StarRating from '../../FoodReview/StarRating';

const GenerateRestaurant = ({ id, collabId, restaurantList, setCollabId, setResults }) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [restriction, setRestriction] = useState(null);
    const [selections, setSelections] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [percentageMatch, setPercentageMatch] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                console.log('collabId:', collabId);
                if (collabId) {
                    await getSelections();
                }
                // if (restaurant) {
                //     updateHistory();
                // }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [collabId]); // Dependency array should include only collabId

    useEffect(() => {
        console.log('Selections state updated:', selections);
        if (selections.length > 0) {
            generateRestaurant();
        }
    }, [selections]);

    useEffect(() => {
        console.log('Best restaurant updated: ', restaurant);
        const getHistory = async () => {
            try {
                if (restaurant) {
                   await updateHistory(); 
                }
            } catch (err) {
                console.log(err);
            }
        }
        getHistory();
    }, [restaurant]);

    const getSelections = async () => {
        try {
            if (!collabId) {
                console.error('Collab ID is null or undefined');
                return;
            }

            const { data: selectionData, error: selectionError } = await supabase
                .from('join_collab')
                .select('*')
                .eq('collab_id', collabId);

            if (selectionError) {
                throw selectionError;
            }

            console.log('Selection Data:', selectionData);

            if (selectionData && selectionData.length > 0) {
                setSelections(selectionData);
                determineRestriction(selectionData);
            } else {
                console.error('No selections found for the given collab ID');
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleReturnToGroupPage = () => {
        setResults(false);
    };

    const determineRestriction = (selectionData) => {
        const restriction = selectionData.find(selection => selection.restriction === 'Vegetarian')
            ? 'Vegetarian'
            : selectionData.find(selection => selection.restriction === 'Halal')
                ? 'Halal'
                : null;

        setRestriction(restriction);
    };

    const generateRestaurant = () => {
        if (!restaurantList.length || !selections.length) {
            console.error('Restaurant list or selections are empty');
            return;
        }

        console.log("Generating restaurants...");

        const priceMap = {};
        const locationMap = {};
        const cuisineMap = {};

        for (const selection of selections) {
            if (selection.category === 'price') {
                priceMap[selection.option] = (priceMap[selection.option] || 0) + 1;
            } else if (selection.category === 'location') {
                locationMap[selection.option] = (locationMap[selection.option] || 0) + 1;
            } else {
                cuisineMap[selection.option] = (cuisineMap[selection.option] || 0) + 1;
            }
        }

        let priceMax = Math.max(...Object.values(priceMap), 0);
        let locationMax = Math.max(...Object.values(locationMap), 0);
        let cuisineMax = Math.max(...Object.values(cuisineMap), 0);

        let priceFilter = Object.keys(priceMap).filter(key => priceMap[key] === priceMax);
        let locationFilter = Object.keys(locationMap).filter(key => locationMap[key] === locationMax);
        let cuisineFilter = Object.keys(cuisineMap).filter(key => cuisineMap[key] === cuisineMax);

        console.log(`Price Filter: ${priceFilter}, Location Filter: ${locationFilter}, Cuisine Filter: ${cuisineFilter}`);

        let possibleRestaurants = restaurantList;

        if (restriction) {
            const filteredRestaurants = possibleRestaurants.filter(restaurant => restaurant.special_conditions === restriction);
            if (filteredRestaurants.length) {
                possibleRestaurants = filteredRestaurants;
            }
        }

        if (priceFilter.length) {
            const filteredRestaurants = possibleRestaurants.filter(restaurant => priceFilter.includes(restaurant.rest_price));
            if (filteredRestaurants.length) {
                possibleRestaurants = filteredRestaurants;
            }
        }

        if (locationFilter.length) {
            const filteredRestaurants = possibleRestaurants.filter(restaurant => locationFilter.includes(restaurant.rest_location));
            if (filteredRestaurants.length) {
                possibleRestaurants = filteredRestaurants;
            }
        }

        if (cuisineFilter.length) {
            const filteredRestaurants = possibleRestaurants.filter(restaurant => cuisineFilter.includes(restaurant.cuisine));
            if (filteredRestaurants.length) {
                possibleRestaurants = filteredRestaurants;
            }
        }

        // const bestRestaurant = possibleRestaurants[0];
        const bestRestaurant = possibleRestaurants[Math.floor(Math.random() * possibleRestaurants.length)];
        const maxMatches = priceMax + locationMax + cuisineMax;
        console.log("Max Matches: ", maxMatches);
        const percentage = ((maxMatches) / (selections.length)) * 100;
        console.log("Percentage match is", percentage)

        console.log("Best match restaurant:", bestRestaurant);

        setRestaurant(bestRestaurant);
        setPercentageMatch(Math.round(percentage));
        // setPercentageMatch(percentage.toFixed(0)); // Rounded
    };

    const updateHistory = async () => {
        setLoading(true);
        try {
            const { data: history, error: historyError } = await supabase
                .from('collab_history')
                .insert({
                    chat_id: id,
                    collab_id: collabId,
                    rec_rest: restaurant
                });

            if (historyError) {
                throw historyError;
            }
            // setLoading(false);

        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <span>This will take about 5 minutes or so. Please do not refresh.</span>
                <Loading />
            </div>
        );
    }

    return (
        <div className="container">
            {percentageMatch && <div>{percentageMatch}% Match</div>}
            {restaurant && (
                <div className="d-flex justify-content-between">
                    <div className="ResultRestaurantKey" onClick={() => navigate(`/restaurants/${restaurant.rest_id}`)}>
                        <img src={restaurant.image_url} alt={restaurant.rest_name} className="restImage" />
                        <div className='row1'>
                            <div className="restName">{restaurant.rest_name}</div>
                            <div className="priceRange">{restaurant.rest_price}</div>
                            <div className="rating"><StarRating stars={restaurant.average_star} /> {restaurant.average_star} ({restaurant.num_review})</div>
                            <div className="cuisine">{restaurant.cuisine}</div>
                            <div className='location'>{restaurant.rest_location}</div>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={handleReturnToGroupPage} className="generate-button">Return to Group Page</button>
        </div>
    );
};

export default GenerateRestaurant;