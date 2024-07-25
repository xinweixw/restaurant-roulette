import React, { useContext, useEffect, useState } from 'react';
import StarRating from './StarRating';
import Review from './Review';
import RestaurantInfo from './RestaurantInfo';
import { useNavigate, useParams } from 'react-router-dom';
import { RestaurantsContext } from '../context/RestaurantsContext';
import RestaurantBackend from '../apis/RestaurantBackend';
import AddReview from './AddReview';
import Popup from '../Favourites/Popup';
import AddToFavourite from './AddToFavourite';
import AddNewFolder from './AddNewFolder';
// import Drawer from '@mui/material/Drawer';


const RestaurantPage = () => { 
  const { id } = useParams();
  const { selectedRestaurant, setSelectedRestaurant } = useContext(RestaurantsContext);
  const [loading, setLoading] = useState(true);
  const [favFolder, setFavFolder] = useState([]); // folders without the restaurant
  const [inFav, setInFav] = useState([]); // folders with the restaurant
  const navigate = useNavigate();

  const addInFav = (addToFav) => {
    setInFav([...inFav, ...addToFav]);
  };

  const addFavFolder = (aFolder) => {
    setFavFolder([...favFolder, ...aFolder]);
  };

  const createNewFolder = (newFave) => {
    setFavFolder([...favFolder, newFave]);
  }; 

  // handle popup
  const [isClicked, setIsClicked] = useState(false);
  const [adding, setIsAdding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const getData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await RestaurantBackend.get(`/${id}`); 
        // console.log('Fetched data:', response.data);
        setSelectedRestaurant(response.data.data);

        // add to favourites
        const result = await RestaurantBackend.get(`/${id}/favourite`, {
          headers: {
            token: token
          }
        });

        setFavFolder(result.data.data.notFav);
        setInFav(result.data.data.fav);

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
      <button onClick={() => navigate("/food-search")} className="d-flex justify-content-start ms-2 ps-2"><i className="fa-solid fa-chevron-left"></i></button>
      {selectedRestaurant && (
        <>
          <RestaurantInfo oneRestaurant={selectedRestaurant.restaurant} setIsClicked={setIsClicked} inFav={inFav} setInFav={setInFav} addFavFolder={addFavFolder} setIsAdding={setIsAdding} />
          {/* <div className="text-center">
            <StarRating stars={selectedRestaurant.restaurant.average_star} />
            <span className="text-warning ms-1">
              {selectedRestaurant.restaurant.num_review ? `(${selectedRestaurant.restaurant.num_review})` : "(0)"}
            </span>
          </div> */}
          <div className="my-3 p-3">
            <AddReview />
          </div>
          <Review />

          <Popup isClicked={isClicked} setIsClicked={setIsClicked}>
            <AddToFavourite favFolders={favFolder} setFavFolder={setFavFolder} addInFav={addInFav} setIsClicked={setIsClicked} />
          </Popup>

          <Popup isClicked={adding} setIsClicked={setIsAdding}>
            <AddNewFolder setIsClicked={setIsAdding} createNewFolder={createNewFolder} />
          </Popup>
        </>
      )}
    </div>
  );
}

export default RestaurantPage;
