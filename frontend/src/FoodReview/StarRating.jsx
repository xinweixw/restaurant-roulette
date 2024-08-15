import React from 'react';
import "./RestaurantPage.css";


const StarRating = ({ stars }) => {
    const numStars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= stars) {
            numStars.push(<i key={i} className="fa-solid fa-star text-warning"></i>);
        } else if (i === Math.ceil(stars) && !Number.isInteger(stars)) {
            numStars.push(<i key={i} className="fa-solid fa-star-half-stroke text-warning"></i>);
        } else {
            numStars.push(<i key={i} className="fa-regular fa-star text-warning"></i>);
        }
    };

    return (
        <>
            {numStars}
        </>
    ); 
};

export default StarRating;