import React, { createContext, useState } from 'react'; 

export const RestaurantsContext = createContext(); 

export const RestaurantsContextProvider = (props) => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [revs, setReviews] = useState([]);

    const addReviews = (review) => {
        setReviews([...revs, review]);
    };

    return (
        <RestaurantsContext.Provider
            value={{
                restaurants,
                setRestaurants,
                selectedRestaurant,
                setSelectedRestaurant,
                revs, setReviews, addReviews
            }}>
            {props.children}
        </RestaurantsContext.Provider>
    );
};