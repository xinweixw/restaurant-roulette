import React, { useState } from 'react';
import FavouritesBackend from '../apis/FavouritesBackend';

const AddNewFolder = ({setIsClicked, createNewFolder}) => {
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
            } catch (err) {
                console.log(err);
            }
            setIsClicked(false);
        }
    }
  return (
      <div>
          <form action="">
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