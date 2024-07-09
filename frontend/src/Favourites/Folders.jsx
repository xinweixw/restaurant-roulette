import React from 'react';
import { useNavigate } from 'react-router-dom';

const Folders = ({ folders }) => {
    const navigate = useNavigate();
    const handleFolderSelect = (id) => {
        navigate(`/favourites/${id}`);
    };

    return (
        <div className="row">
            {/* row-cols-3 mb-2   */}
            {folders.map((folder) => {
                return (
                    <div onClick={() => handleFolderSelect(folder.folder_id)} key={folder.folder_id} className="card mb-3 me-4" style={{ backgroundColor: "#FFEF99" }}>
                        <div className="card-header d-flex justify-content-start">
                            <span className="text-start"><i className="fa-regular fa-folder"></i> {folder.folder_name}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Folders;