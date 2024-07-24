import React from 'react';
import { useState, useNavigate } from 'react-router-dom';

const GroupTab = ({ group }) => {
    const navigate = useNavigate();

    const handleSelectGroupTab = () => {
        navigate(`/bite-buddies/group/${group.chat_id}`);
    }

    return (
        <div className="GroupTab" onClick={handleSelectGroupTab}>
            <div className='groupName'>{group.chat_name}</div>
        </div>

        
    );
};

export default GroupTab;
