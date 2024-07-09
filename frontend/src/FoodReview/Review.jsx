import React, { useContext, useEffect } from 'react';
import StarRating from './StarRating';
import { useNavigate, useParams } from 'react-router-dom';
import RestaurantBackend from '../apis/RestaurantBackend';
import { RestaurantsContext } from '../context/RestaurantsContext';
import { toast } from 'react-toastify';

const Review = (props) => {
  const { id } = useParams();
  const { revs, setReviews, addReviews } = useContext(RestaurantsContext);
  const navigate = useNavigate();

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
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to delete a review!");
    }

    try {
      const response = await RestaurantBackend.delete(`/${id}/review/${reviewid}`, {
        headers: {
          token: token
        }
      });
      
      setReviews(revs.filter(review => {
        return review.review_id !== reviewid
      }));

      toast("Review deleted!");
      

    } catch (err) {
      console.error(err.message);
      toast.warning("You cannot delete this review!");
    }
  }

  const handleUpdate = async (e, restid, reviewid) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to update a review!");
    }

    try {
      const response = await RestaurantBackend.get(`/${id}/review/${reviewid}`, {
        headers: {
            token: token
        }
      }); 

      navigate(`/restaurants/${restid}/review/${reviewid}`);
    } catch (err) {
      console.error(err.message);
      toast.warning("You cannot update this review");
    }
  };

  return (
    <div className="row">
       {/* row-cols-3 mb-2 */}
      {revs.length >= 1 ? (<h2 className="text-start justify-content-start">Reviews: </h2>) : ""}
      {revs.map((review) => {
        return (
          <div key={review.review_id} className="card border-warning-subtle mb-3 me-4">
            <div className="card-header d-flex justify-content-between">
              <span>{review.user_name}</span>
              <span><StarRating stars={review.star} /></span>
            </div>
            <div className="card-body">
              <p className="card-text">{review.review}</p>
              <button onClick={e => handleUpdate(e, review.rest_id, review.review_id)} className="btn btn-info me-2">Update</button>
              <button onClick={e => handleDelete(e, review.review_id)} className="btn btn-warning me-2">Delete</button>
            </div>
          </div>
        )
      })}
    </div>
  ); 
}

export default Review;