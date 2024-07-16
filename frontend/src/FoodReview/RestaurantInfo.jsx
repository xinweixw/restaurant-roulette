import React from 'react';
import StarRating from './StarRating';
import { toast } from 'react-toastify';
import RestaurantBackend from '../apis/RestaurantBackend';
import { useNavigate } from 'react-router-dom';

const RestaurantInfo = ({oneRestaurant, setIsClicked, inFav, setInFav, addFavFolder, setIsAdding}) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation(); 
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to remove a restaurant!");
    }

    try {
      const response = await RestaurantBackend.delete(`/${oneRestaurant.rest_id}/favourite`, {
        headers: {
          token: token
        }
      }); 

      setInFav([]); 
      addFavFolder(inFav);
      toast('Restaurant removed from favourites!');
      navigate(`/restaurants/${oneRestaurant.rest_id}`);
    } catch (err) {
      console.error(err.message);
    }
  }

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
            <img src={oneRestaurant.image_url} className="img-thumbnail rounded float-end" alt="Food place logo" style={{maxWidth: "90%"}}/>
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
            {/* added for add to favourites */}
            <div className="btn-group my-1 p-2" role="group" aria-label="Add and Delete">
              <button onClick={() => setIsClicked(true)} className="btn btn-primary">Add to Favourites</button>
              {inFav.length < 1 ? (<button className="btn btn-secondary" disabled>Remove from Favourites</button>) :
              (<button onClick={handleDelete} className="btn btn-info">Remove from Favourites</button>)}
              <button onClick={() => setIsAdding(true)} className="btn btn-light"><i className="fa-solid fa-plus"></i><i className="fa-regular fa-folder"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfo;