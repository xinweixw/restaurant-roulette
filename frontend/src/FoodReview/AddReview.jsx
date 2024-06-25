import React, { useContext, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import RestaurantBackend from '../apis/RestaurantBackend';
import { RestaurantsContext } from '../context/RestaurantsContext';

const AddReview = () => {
    const { id } = useParams();
    const location = useLocation();
    let navigate = useNavigate();
    const [reviewField, setReviewField] = useState("");
    const [star, setStar] = useState("Rating");
    const { addReviews } = useContext(RestaurantsContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            // alert("You must be logged in to add a review!");
            toast.error("You must be logged in to leave a review!");
            return;
        }
        
        try {
            // const body = { star, reviewField };
            // const response = await fetch(`http://localhost:5000/api/restaurants/${id}/review`, {
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify(body)
            // }); 
            const response = await RestaurantBackend.post(`/${id}/review`, {
                star, 
                review: reviewField
            }, {
                headers: {
                    token: token
                }
            }); 
            // newly added 
            addReviews(response.data.data.review);
            // navigate('/homepage');
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="my-2">
            <form onSubmit={handleSubmit}>
                <div className="container">
                    <div className="mb-2">
                        <label htmlFor="star">Rating</label>
                        <select className="form-select" value={star} onChange={e => setStar(e.target.value)} id="star" type="text" required>
                            <option disabled>Rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="review">Review</label>
                        <textarea value={reviewField} onChange={e => setReviewField(e.target.value)}
                            id="review" className="form-control" required></textarea>
                    </div>
                    <button type="submit" className="btn btn-warning">Add Review</button>
                </div>
            </form>
        </div>
    )
}

export default AddReview;