import React, { useContext, useEffect } from 'react';
import StarRating from './StarRating';
import { useNavigate, useParams } from 'react-router-dom';
import RestaurantBackend from '../apis/RestaurantBackend';
import { RestaurantsContext } from '../context/RestaurantsContext';

const Review = (props) => {
  const { id } = useParams();
  const { revs, setReviews, addReviews } = useContext(RestaurantsContext);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await RestaurantBackend.get(`/${id}`);
        setReviews(response.data.data.reviews);
      } catch (err) {
        console.error(err.message);
      }
    }
    getData();
  },[]);

  const handleDelete = async (e, reviewid) => {
    e.stopPropagation();
    try {
      const response = await fetch(`https://restaurant-roulette-backend.vercel.app/api/restaurants/${id}/review/${reviewid}`, {
        method: "DELETE"
      });

      useNavigate("/homepage");
    
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="row row-cols-3 mb-2">
      {revs.map((review) => {
        return (
          <div key={review.review_id} className="card border-warning-subtle mb-3 me-4" style={{ maxWidth: "30%" }}>
            <div className="card-header d-flex justify-content-between">
              <span>{review.user_name}</span>
              <span><StarRating stars={review.star} /></span>
            </div>
            <div className="card-body">
              <p className="card-text">{review.review}</p>
              <div onClick={e => handleDelete(e, review.review_id)} className="btn btn-warning">Delete</div>
            </div>
          </div>
        )
      })}
    </div>
  ); 
}

export default Review;