import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import RestaurantBackend from '../apis/RestaurantBackend';
import { useParams } from 'react-router-dom';

const AddToFavourite = ({ favFolders, setFavFolder, addInFav, setIsClicked }) => {
    const { id } = useParams();
    const [checkboxes, setCheckboxes] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const [selectedNames, setSelectedNames] = useState([]);
    const names = favFolders.map((folder) => folder.folder_name);

    const handleChange = (folderId, folderName) => {
        setCheckboxes([...checkboxes, folderId]);
        setSelectedNames([...selectedNames, folderName]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("You must be logged in to save a restaurant!");
            return;
        }

        if (checkboxes.length < 1) {
            setErrMsg("Please choose a folder");
            // console.log(names);
            // console.log(names.includes('All'));
            return;
        } else if (names.includes('All') && !selectedNames.includes('All')) {
            setErrMsg("Please select the All folder");
            return;
        } else {
            setErrMsg("");
            try {
                const response = await RestaurantBackend.post(`/${id}/favourite`, {
                    folders: checkboxes
                }, {
                    headers: {
                        token: token
                    }
                });

                // to render add to fav folder list
                setFavFolder(favFolders.filter(favFolder => {
                    return !(checkboxes.includes(favFolder.folder_id));
                }));

                const favourited = favFolders.filter(favFolder => {
                    return checkboxes.includes(favFolder.folder_id);
                });
                addInFav(favourited);
    
                toast("Restaurant saved!");
            } catch (err) {
               console.error(err.message); 
            }
    
            setIsClicked(false);
        }

        
    }

  return (
    <div>
        <form action="">
            {favFolders && favFolders.map((folder) => {
                return (
                    <div key={folder.folder_id}>
                        {folder.folder_name === "All" ? (
                            <div>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    value={folder.folder_id}
                                    name="favourite"
                                    id={folder.folder_id}
                                    onChange={() => handleChange(folder.folder_id, folder.folder_name)}
                                    required
                                />
                                <label className="form-check-label" htmlFor={folder.folder_id}>
                                    {folder.folder_name}
                                </label>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    value={folder.folder_id}
                                    name="favourite"
                                    id={folder.folder_id}
                                    onChange={() => handleChange(folder.folder_id, folder.folder_name)}
                                />
                                <label className="form-check-label" htmlFor={folder.folder_id}>
                                    {folder.folder_name}
                                </label>
                            </div>
                        )}
                    </div>
                )
            })}

            {favFolders ? (
                <button onClick={handleSubmit} type="submit" className="btn btn-primary my-1 p-2">Save</button>
            ) : (
                <p>This restaurant is already saved in every folder</p>
            )}

            {errMsg && <p>{errMsg}</p>}
        </form>
    </div>
  )
}

export default AddToFavourite;