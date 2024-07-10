import React, { useContext, useEffect, useState } from 'react';
import StarRating from './StarRating';
import Review from './Review';
import RestaurantInfo from './RestaurantInfo';
import { useNavigate, useParams } from 'react-router-dom';
import { RestaurantsContext } from '../context/RestaurantsContext';
import RestaurantBackend from '../apis/RestaurantBackend';
import AddReview from './AddReview';

const RestaurantPage = () => { 
  const { id } = useParams();
  const { selectedRestaurant, setSelectedRestaurant } = useContext(RestaurantsContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await RestaurantBackend.get(`/${id}`); 
        console.log('Fetched data:', response.data);
        setSelectedRestaurant(response.data.data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false); // End loading
      }
    }; 

    getData();
  }, [id]);

  if (loading) {
    return (
      <h1 className="loadIcon">
        <i className="bx bx-loader-circle bx-spin"/>
      </h1>
    );
  }

  return (
    <div>
      {selectedRestaurant && (
        <>
          <RestaurantInfo oneRestaurant={selectedRestaurant.restaurant} />
          {/* <div className="text-center">
            <StarRating stars={selectedRestaurant.restaurant.average_star} />
            <span className="text-warning ms-1">
              {selectedRestaurant.restaurant.num_review ? `(${selectedRestaurant.restaurant.num_review})` : "(0)"}
            </span>
          </div> */}
          <div className="my-3">
            <Review />
          </div>
          <AddReview />
        </>
      )}
    </div>
  );
}

export default RestaurantPage;
