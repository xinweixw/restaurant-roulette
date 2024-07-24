import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../FoodSearch/config/SupabaseClient';
import { toast } from 'react-toastify';
import Loading from '../../assets/Loading';
import { ResultRestaurant } from '../../FoodSearch/components/ResultRestaurant';
import StarRating from '../../FoodReview/StarRating';

const GenerateRestaurant = ({ id, collabId, restaurantList, setCollabId, setResults}) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [restriction, setRestriction] = useState(null);
    const [selections, setSelections] = useState([]);
    //const [restaurantList, setRestaurantList] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [percentageMatch, setPercentageMatch] = useState(null);

    useEffect(() => {
        setLoading(true);
        //setCollabId(70);
        console.log('collad id: ', collabId);
        if (collabId) {
            //fetchAllRestaurants();
            console.log(restaurantList);
            getSelections();
        }
        if (restaurant) {
            updateHistory();
        }
    }, [collabId]);
    
    const handleReturnToGroupPage = () => {
        setResults(false);
        //setCollabId(null);
    };

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
    
            console.log(selectionData);
            setSelections(selectionData);
    
            determineRestriction(selectionData);
    
            // after getting selections and determining restriction, generate restaurant
            generateRestaurant();
    
        } catch (err) {
            console.log(err.message);
        }
    };
    

    const determineRestriction = (selectionData) => {
        // Determine dietary restriction based on selections
        // assuming only one restriction is possible, the most "serious" one
        const restriction = selectionData.find(selection => selection.option === 'Vegan')
            ? 'Vegan'
            : selectionData.find(selection => selection.option === 'Vegetarian')
                ? 'Vegetarian'
                : selectionData.find(selection => selection.option === 'Halal')
                    ? 'Halal'
                    : null;

        setRestriction(restriction);
    };

    /*const fetchAllRestaurants = async () => {
        try {
            const { data, error } = await supabase
                .from('restaurants')
                .select('*');

            if (error) {
                console.error("Error fetching data: ", error);
            } else {
                setRestaurantList(data);
            }

        } catch (err) {
            console.log(err.message);
        }
    };*/

    const generateRestaurant = () => {
        if (!restaurantList.length || !selections.length) {
            return;
        }
    
        // Convert selections array to object for O(1) access
        const selectionMap = {};
        selections.forEach(selection => {
            selectionMap[selection.category] = selection.option;
        });

        // Track best match restaurant
        let bestRestaurant = null;
        let maxMatches = -1;

        // Iterate over restaurants to find the best match
        restaurantList.forEach(restaurant => {
            // Check if restaurant meets initial restriction
            if (restriction && restaurant.special_conditions !== restriction) {
                return; // Skip this restaurant
            }

            // Check if restaurant does not meet category selection
            //if (selectionMap.category === 'cuisine' && restaurant.cuisine !== selectionMap.option) {
            //  return; // Skip this restaurant
            //}

            let matches = 0;

            // Check each selection criterion against the restaurant deets
            ['cuisine', 'price', 'location'].forEach(category => {
                if (selectionMap[category] && restaurant[`${category}`] === selectionMap[category]) {
                    matches++;
                }
            });

            // Check if current restaurant is better match
            if (matches > maxMatches) {
                maxMatches = matches;
                bestRestaurant = restaurant;
            }

            // exit the loop early if already found the best possible match
            if (maxMatches === selections.length) {
                return false; // Break forEach loop
            }
        });

        // bestRestaurant contains the restaurant with the maximum matches
        console.log("Best match restaurant:", bestRestaurant);

    
        // Calculate percentage match
        const percentage = ((1 + maxMatches) / (selections.length + 1)) * 100;
    
        // Update state with best restaurant and percentage match
        setRestaurant(bestRestaurant);
        setPercentageMatch(percentage.toFixed(0)); // Rounded
    };

    const updateHistory = async () => {
        try {
            const {data: history, error: historyError} = await supabase 
                .from('collab_history')
                .insert({chat_id : id, 
                         collab_id : collabId,
                         rec_rest : restaurant
                });
                
            if (historyError) {
                throw historyError;
            }
            setLoading(false);

        } catch (err) {
            console.log(err.message);
        }
    };
    

    if (loading) {
        return (<div> 
            <span>This will take about 5 minutes or so. Please do not refresh.</span>
            <Loading />
            </div>);
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
            <button onClick={handleReturnToGroupPage}>Return to Bite Buddies</button>
        </div>
    );
};

export default GenerateRestaurant;
