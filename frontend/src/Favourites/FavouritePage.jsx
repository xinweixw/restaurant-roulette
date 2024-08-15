import React, { useEffect, useState } from 'react';
import FavouritesBackend from '../apis/FavouritesBackend';
import Folders from './Folders';
import Popup from './Popup';
import { toast } from 'react-toastify';
import Loading from '../assets/Loading';

const FavouritePage = () => {
    const [allFolders, setAllFolders] = useState([]);
    const addFolders = (newFolder) => {
        setAllFolders([...allFolders, newFolder]);
    };
    const [folderNames, setFolderNames] = useState([]);

    // added from FavouriteHeader
    const [isClicked, setIsClicked] = useState(false);
    const [fName, setFName] = useState("");
    const [errMsg, setErrMsg] = useState("");

    // loading
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            // alert("You must be logged in to add a review!");
            toast.error("You must be logged in to create a folder!");
            return;
        }

        if (!fName) {
            toast.error("Please name your folder!");
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
                addFolders(response.data.data.folder);
                // added to remove previous input
                setFName("");
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
                setLoading(true);
                const response = await FavouritesBackend.get("/", {
                    headers: {
                        token: token
                    }
                });
                const everyFolder = response.data.data.folders;
                setAllFolders(response.data.data.folders);
                setFolderNames(everyFolder.map((folder) => folder.folder_name));
                console.log("The folder names are ", folderNames);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        getData();
        console.log("The folder names are ", folderNames);
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='fav-container'>
            <h1 className="fav-header">Favourites</h1>
            <br />
            <button onClick={() => setIsClicked(true)}>Add Folder</button>

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
                    <button onClick={handleSubmit} type="submit">Add</button>
                </form>
            </Popup>
        </div>
    );
}

export default FavouritePage;