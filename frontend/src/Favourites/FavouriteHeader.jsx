import React, { useState } from 'react';
import Popup from './Popup';
import { toast } from 'react-toastify';
import FavouritesBackend from '../apis/FavouritesBackend';

const FavouriteHeader = ({addFolders}) => {
    const [isClicked, setIsClicked] = useState(false);
    const [fName, setFName] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            // alert("You must be logged in to add a review!");
            toast.error("You must be logged in to leave a review!");
            return;
        }

        try {
            const response = await FavouritesBackend.post("/", {
                folder_name: fName
            }, {
                headers: {
                    token: token
                }
            }); 
            addFolders(response.data.data.folder);
        } catch (err) {
            console.log(err);
        }

        setIsClicked(false);
    }

    return (
        <div>
            <main>
                <h1 className="font-weight-light diplay-1 text-center text-body-warning">
                    Favourites
                </h1>
                <br />
                <button onClick={() => setIsClicked(true)}>Add Folder</button>
            </main>
            
            <Popup isClicked={isClicked} setIsClicked={setIsClicked}>
                <form action="">
                    <label className="me-2" htmlFor="newFolderName">Folder Name: </label>
                    <input
                        type="text"
                        id="newFolderName"
                        value={fName}
                        onChange={e => setFName(e.target.value)}
                        required
                    />
                    <button onClick={handleSubmit} type="submit">Add</button>
                </form>
            </Popup>

        </div>
    )
}
export default FavouriteHeader;