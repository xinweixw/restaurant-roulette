import React from 'react';
import "./ResultRestaurant.css";

export const ResultRestaurant = ({ result, onSelect }) => {
    return (
        <div className="ResultRestaurantKey" onClick={() => onSelect(result.rest_id)}>
            <img src={result.image_url} alt={result.rest_name} className="restImage" />
            <div className='row1'>
                <div className="restName">{result.rest_name}</div>
                <div className="priceRange">{result.rest_price}</div>
                <div className="rating">{result.rating}</div>
                <div className="cuisine">{result.cuisine}</div>
                <div className='location'>{result.rest_location}</div>
            </div>
        </div>
    );
};
