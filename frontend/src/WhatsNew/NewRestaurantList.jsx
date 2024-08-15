import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../FoodSearch/components/ResultRestaurant.css';
import StarRating from '../FoodReview/StarRating';
import "./WhatsNewPage.css";

const NewRestaurantList = ({ newRestaurants }) => {
    const navigate = useNavigate();
    return (
        <div>
            {newRestaurants.map((restaurant) => {
                return (
                        <div className="whatsnew-restaurant" onClick={() => navigate(`/restaurants/${restaurant.rest_id}`)}>
                            <img src={restaurant.image_url} alt={restaurant.rest_name} className="restImage" />
                            <div className='whatsnew-row1'>
                                <div className="whatsnew-info-row">
                                    <div className="whatsnew-restName">{restaurant.rest_name}</div>
                                    <div className="whatsnew-rating"><StarRating stars={restaurant.average_star} /></div>
                            </div>
                            <div className="whatsnew-info-row">
                                <div className="whatsnew-cuisine">
                                    <i className='bx bxs-bowl-rice'></i>
                                    {restaurant.cuisine}</div>
                                <div className="whatsnew-priceRange">{restaurant.rest_price}</div>
                            </div>
                            <div className="whatsnew-info-row">
                                <div className='whatsnew-location'>
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