import React from 'react';
import { useNavigate } from 'react-router-dom';

const GroupTab = ({ group }) => {
    const navigate = useNavigate();

    const handleSelectGroupTab = (group) => {
        navigate('/');
    }

    return (
        <div className="GroupTab" onClick={() => handleSelectGroupTab}>
            <div className='groupName'>{group.chat_name}</div>
        </div>
    );
};

export default GroupTab;
