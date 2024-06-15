import React from 'react';
import StarRating from './StarRating';

const RestaurantInfo = ({oneRestaurant}) => {
  return (
    <div>
      {/* {oneRestaurant.map((food) => {
        return (
          <div key={food.rest_id} className="container text-center">
            <div className="row">
              <div className="col">
                <img src={food.image_url} class="rounded float-start" alt="Food place logo" />
              </div>
              <div className="col text-center">
                <h4 className="display-4">{food.rest_name}</h4>
                <span>{food.cuisine}</span>
                <span>{food.price}</span>
                <span>Region: {food.rest_location}</span>
                <span>Address: {food.rest_address}</span>
              </div>
            </div>
          </div>
        );
      })}; */}
      <div key={oneRestaurant.rest_id} className="text-center">
        <div className="row">
          <div className="col">
            <img src={oneRestaurant.image_url} className="rounded float-start" alt="Food place logo" />
          </div>
          <div className="col text-center">
            <h4 className="display-4">{oneRestaurant.rest_name}</h4>
            <span>Cuisine: {oneRestaurant.cuisine}</span><br></br>
            <span>Halal/Vegetarian: {oneRestaurant.special_conditions}</span><br />
            <span>Price Range: {oneRestaurant.rest_price}</span><br />
            <span>Region: {oneRestaurant.rest_location}</span><br />
            <span>Address: {oneRestaurant.rest_address}</span><br />
            <span>Rating: </span>
            <StarRating stars={oneRestaurant.average_star} />
            <span className="text-warning ms-1">
              {oneRestaurant.num_review ? `(${oneRestaurant.num_review})` : "(0)"}
            </span><br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfo;