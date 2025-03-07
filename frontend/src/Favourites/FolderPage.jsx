import React, { useEffect, useState } from 'react';
import FavouritesBackend from '../apis/FavouritesBackend';
import { useNavigate, useParams } from 'react-router-dom';
import FavRestaurantList from './FavRestaurantList';
import Popup from './Popup';
import { toast } from 'react-toastify';
import Loading from '../assets/Loading';
import "./FolderPage.css";

const FolderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [presentRestaurant, setPresentRestaurant] = useState([]);
  const [loading, setLoading] = useState(false);

  // handle popup form for edit
  const [isClicked, setIsClicked] = useState(false);
  const [fName, setFName] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // handle popup button for delete
  const [isDeleting, setIsDeleting] = useState(false);

  // handle edit names
  const [folderNames, setFolderNames] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const getData = async () => {
      try {
        setLoading(true);
        const response = await FavouritesBackend.get(`/${id}`, {
          headers: {
            token: token
          }
        });

        const result = await FavouritesBackend.get("/", {
          headers: {
            token: token
          }
        });

        // console.log(response.data.data);
        setSelectedFolder(response.data.data.folder);
        setPresentRestaurant(response.data.data.restaurants);
        const everyFolder = result.data.data.folders;
        setFolderNames(everyFolder.map((folder) => folder.folder_name));
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to edit a folder!");
      return;
    }

    if (fName.toLowerCase() === "all") {
      setErrMsg("Please enter a different name. 'All' is not allowed");
      return;
    } else if (folderNames.includes(fName)) {
      setErrMsg("You already have a folder with the same name. Please give this folder a different name.");
      return;
    } else {
      setErrMsg("");
      try {
        const response = await FavouritesBackend.put(`/${id}`, {
          folder_name: fName
        }, {
          headers: {
            token: token
          }
        });
        console.log(response.data.data);
        setSelectedFolder(response.data.data.folder);
      } catch (err) {
        console.error(err.message);
      }
      setIsClicked(false);
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation(); 
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to delete a folder!");
    }

    try {
      const response = await FavouritesBackend.delete(`/${id}`, {
        headers: {
          token: token
        }
      }); 

      setIsDeleting(false);

      navigate("/favourites");
    } catch (err) {
      console.error(err.message);
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <button onClick={() => navigate("/favourites")} className="back-button"><i className="fa-solid fa-chevron-left"></i></button>
      {selectedFolder && <h1 className="text-body-warning text-center">{selectedFolder.folder_name}</h1>}
      <br />
      {selectedFolder && selectedFolder.folder_name !== "All" ? (<button onClick={() => setIsClicked(true)} className="folder-btn">Edit Folder</button>) : 
      ""}
      {selectedFolder && selectedFolder.folder_name !== "All" ? (<button onClick={() => setIsDeleting(true)}  className="folder-btn">Delete Folder <i className="fa-solid fa-trash"></i></button>) : 
      ""}
      <br /><br />

      <div className="my-3">
        {presentRestaurant && (
          <FavRestaurantList folder={selectedFolder} restaurants={presentRestaurant} setPresentRestaurant={setPresentRestaurant} />
        )}
      </div>
      

      <Popup isClicked={isClicked} setIsClicked={setIsClicked}>
        <form>
          <label className="me-2" htmlFor="newFolderName">Edit Name: </label>
          <input
            type="text"
            id="newFolderName"
            value={fName}
            onChange={e => setFName(e.target.value)}
            required
          />
          {errMsg && <p>{errMsg}</p>}
          <button onClick={handleSubmit} type="submit">Edit</button>
        </form>
      </Popup>

      <Popup isClicked={isDeleting} setIsClicked={setIsDeleting} >
        <div>
          <p>Are you sure you want to delete this folder?</p>
          <button onClick={(e) => handleDelete(e)}>Yes</button>
        </div>
      </Popup>

    </div>
  )
}

export default FolderPage;