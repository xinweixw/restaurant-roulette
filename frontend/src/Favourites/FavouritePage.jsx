import React, { useEffect, useState } from 'react';
import FavouritesBackend from '../apis/FavouritesBackend';
import Folders from './Folders';
import Popup from './Popup';
import { toast } from 'react-toastify';

const FavouritePage = () => {
    const [allFolders, setAllFolders] = useState([]);
    const addFolders = (newFolder) => {
        setAllFolders([...allFolders, newFolder]);
    };

    // added from FavouriteHeader
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
                addFolders(response.data.data.folder);
            } catch (err) {
                console.log(err);
            }
            setIsClicked(false);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        const getData = async () => {
            try {
                const response = await FavouritesBackend.get("/", {
                    headers: {
                        token: token
                    }
                });
                setAllFolders(response.data.data.folders);
            } catch (err) {
                console.error(err.message);
            }
        };
        getData();
    }, []);

    return (
        <div>
            <h1 className="text-warning text-center">Favourites</h1>
            <br />
            <button onClick={() => setIsClicked(true)} className="btn btn-primary">Add Folder</button>

            <div className="my-3">
                {allFolders && (
                    <Folders folders={allFolders} />
                )}
            </div>

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
                    {errMsg && <p>{errMsg}</p>}
                    <button onClick={handleSubmit} className="btn btn-primary ms-2" type="submit">Add</button>
                </form>
            </Popup>
        </div>
    );
}

export default FavouritePage;