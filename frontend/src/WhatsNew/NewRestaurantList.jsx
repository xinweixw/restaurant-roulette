import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../FoodSearch/components/ResultRestaurant.css';
import StarRating from '../FoodReview/StarRating';

const NewRestaurantList = ({ newRestaurants }) => {
    const navigate = useNavigate();
    return (
        <div>
            {newRestaurants.map((restaurant) => {
                return (
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

                );
            })}
        </div>
    )
};

export default NewRestaurantList;