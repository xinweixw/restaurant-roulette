import React from 'react';
import "./ResultRestaurant.css";
import StarRating from '../../FoodReview/StarRating';

export const ResultRestaurant = ({ result, onSelect }) => {
    return (
        <div className="ResultRestaurantKey" onClick={() => onSelect(result.rest_id)}>
            <img src={result.image_url} alt={result.rest_name} className="restImage" />
            <div className='row1'>
                <div className="info-row">
                    <div className="restName">{result.rest_name}</div>
                    <div className="rating"><StarRating stars={result.average_star} /></div>
                </div>
                <div className="info-row">
                    <div className="cuisine">
                        <i className='bx bxs-bowl-rice'></i>
                        {result.cuisine}</div>
                    <div className="priceRange">{result.rest_price}</div>
                </div>
                <div className="info-row">
                    <div className='location'>
                        <i className='bx bx-map'></i>
                        {result.rest_location}</div>
                </div>
            </div>
        </div>
    );
};
