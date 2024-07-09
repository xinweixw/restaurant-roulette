import React from 'react';
import '../FoodSearch/components/ResultRestaurant.css';
import StarRating from '../FoodReview/StarRating';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FavouritesBackend from '../apis/FavouritesBackend';

const FavRestaurantList = ({restaurants, setPresentRestaurant}) => {
    const navigate = useNavigate();

    const handleDelete = async (e, rid, fid) => {
        e.stopPropagation();
        const token = localStorage.getItem("token");

        if (!token) {
            // alert("You must be logged in to add a review!");
            toast.error("You must be logged in to leave a review!");
            return;
        }

        try {
            const response = await FavouritesBackend.delete(`/${fid}/restaurant/${rid}`, {
                headers: {
                    token: token
                }
            });

            setPresentRestaurant(restaurants.filter(restaurant => {
                return restaurant.rest_id !== rid
            }));

        } catch (err) {
            console.error(err.message);
        }
    }
    
    return (
        <div>
            <p className="text-left justify-content-start">{restaurants.length} Restaurants</p>
            {restaurants.map((restaurant) => {
                return (
                    <>
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
                                {/* <button><i className="fa-solid fa-trash"></i></button> */}
                            </div>
                            <button onClick={(e) => handleDelete(e, restaurant.rest_id, restaurant.folder_id)} className="btn"><i className="fa-solid fa-trash"></i></button>
                        </div>
                    </>

                );
            })}
        </div>
    )
}

export default FavRestaurantList;