import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RestaurantsContext } from '../context/RestaurantsContext';
import RestaurantBackend from '../apis/RestaurantBackend';
import { toast } from 'react-toastify';

const UpdateReview = (props) => {
    const { id, reviewid } = useParams();
    let navigate = useNavigate();
    const { revs } = useContext(RestaurantsContext);
    const [star, setStar] = useState("Rating");
    const [reviewField, setReviewField] = useState("");;
    const token = localStorage.getItem("token");

    useEffect(() => {
        const getData = async () => {
            // const token = localStorage.getItem("token");
            const response = await RestaurantBackend.get(`/${id}/review/${reviewid}`, {
                headers: {
                    token: token
                }
            });

            setStar(response.data.data.review.star);
            setReviewField(response.data.data.review.review);
        };
        getData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedReview = await RestaurantBackend.put(`/${id}/review/${reviewid}`, {
                star: star,
                review: reviewField
            }, {
                headers: {
                    token: token
                }
            });
            navigate(`/restaurants/${id}`);
            toast("Review updated!");
        } catch (err) {
            console.error(err.message);
            toast.warning("You cannot update this review");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} >
                <div className="container">
                    <div className="mb-2">
                        <label htmlFor="star">Rating</label>
                        <select className="form-select" value={star} onChange={e => setStar(e.target.value)} id="star" type="text">
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
                            id="review" className="form-control"></textarea>
                    </div>
                    <button type="submit" className="btn btn-info">Update Review</button>
                </div>
            </form>
            <button className="btn btn-outline-dark my-2" onClick={(e) => navigate(`/restaurants/${id}`)} >Cancel</button>
        </div>
    )
};

export default UpdateReview;