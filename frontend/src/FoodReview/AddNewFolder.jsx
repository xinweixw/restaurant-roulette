import React, { useState } from 'react';
import FavouritesBackend from '../apis/FavouritesBackend';
import { toast } from 'react-toastify';
import "./RestaurantPage.css";

const AddNewFolder = ({setIsClicked, createNewFolder, folderNames}) => {
    const [fName, setFName] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            // alert("You must be logged in to add a review!");
            toast.error("You must be logged in to create a new folder!");
            return;
        }

        if (fName.toLowerCase() === 'all') {
            setErrMsg("Please enter a different name. 'All' is not allowed");
            return;
        } else if (folderNames.includes(fName)) {
            setErrMsg("You already have a folder with the same name. Please give this folder a different name.");
            return;
        } else {
            setErrMsg("");
            try {
                const response = await FavouritesBackend.post("/", {
                    folder_name: fName
                }, {
                    headers: {
                        token: token
                    }
                }); 
                createNewFolder(response.data.data.folder);
                toast("New folder created!");
            } catch (err) {
                console.log(err);
            }
            setIsClicked(false);
        }
    }
  return (
      <div>
          <form action="">
              <p style={{color: 'brown'}} className="text-center">Create a new folder to add this restaurant into</p>
              <label className="me-2" htmlFor="newFolderName">Folder Name: </label>
              <input
                  type="text"
                  id="newFolderName"
                  value={fName}
                  onChange={e => setFName(e.target.value)}
                  required
              />
              {errMsg && <p>{errMsg}</p>}
              <button onClick={handleSubmit} className="btn btn-primary ms-2" type="submit">
                  <i className="fa-solid fa-plus"></i><i className="fa-regular fa-folder"></i>
              </button>
          </form>
      </div>
  )
}

export default AddNewFolder;