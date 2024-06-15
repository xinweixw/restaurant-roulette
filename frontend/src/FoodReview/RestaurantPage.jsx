import React, { useContext, useEffect } from 'react';
import StarRating from './StarRating';
import Review from './Review';
import RestaurantInfo from './RestaurantInfo';
import { useNavigate, useParams } from 'react-router-dom';
import { RestaurantsContext } from '../context/RestaurantsContext';
import RestaurantBackend from '../apis/RestaurantBackend';
import AddReview from './AddReview';
// import Drawer from '@mui/material/Drawer';


const RestaurantPage = () => {
  const { id } = useParams();
  const { selectedRestaurant, setSelectedRestaurant } = useContext(RestaurantsContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await RestaurantBackend.get(`/${id}`); 
        console.log('Fetched data:', response.data);
        setSelectedRestaurant(response.data.data)
      } catch (err) {
        console.error(err.message);
      }
    }; 

    getData();
  }, [id]);

  return (
    <div>
      {selectedRestaurant && (
        <>
          <RestaurantInfo oneRestaurant={selectedRestaurant.restaurant} />
          {/* <div className="text-center">
            <StarRating stars={selectedRestaurant.restaurant.average_star} />
            <span className="text-warning ms-1">
              {selectedRestaurant.restaurant.num_review ? `(${selectedRestaurant.restaurant.num_review})` : "(0)"}
            </span>reviews={selectedRestaurant.reviews}
          </div> */}
          <div className="my-3">
            <Review  />
          </div>
          <AddReview />
          <button onClick={e => navigate("/homepage")} className="btn btn-info">Back to Homepage</button>
        </>
      )}
    </div>
  );
}

export default RestaurantPage;