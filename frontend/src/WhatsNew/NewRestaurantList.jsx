import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../FoodSearch/components/ResultRestaurant.css';
import StarRating from '../FoodReview/StarRating';
import "../FoodSearch/components/SearchAutofillKey.css"

const NewRestaurantList = ({ newRestaurants }) => {
    const navigate = useNavigate();
    return (
        <div>
            {newRestaurants.map((restaurant) => {
                return (
                        <div className="ResultRestaurantKey" onClick={() => navigate(`/restaurants/${restaurant.rest_id}`)}>
                            <img src={restaurant.image_url} alt={restaurant.rest_name} className="restImage" />
                            <div className='row1'>
                                <div className="info-row">
                                    <div className="restName">{restaurant.rest_name}</div>
                                    <div className="rating"><StarRating stars={restaurant.average_star} /></div>
                            </div>
                            <div className="info-row">
                                <div className="cuisine">
                                    <i className='bx bxs-bowl-rice'></i>
                                    {restaurant.cuisine}</div>
                                <div className="priceRange">{restaurant.rest_price}</div>
                            </div>
                            <div className="info-row">
                                <div className='location'>
                                    <i className='bx bx-map'></i>
                                    {restaurant.rest_location}</div>
                            </div>
                        </div>
                    </div>            
                );})};
    </div>
    )
};

export default NewRestaurantList;