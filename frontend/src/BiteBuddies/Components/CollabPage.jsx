import { useNavigate } from 'react-router-dom';

const CollabPage = (props) => {
    const navigate = useNavigate();

    return (
        <div className="Container" style={{height: '100vh' }}>
            <div className="GroupName">Group Name</div>
                <button onClick={handleAddMember}> Add Member </button>
                <button onClick={handleStartCollab}>Start Collaboration!</button>
        </div>
    );
};

export default CollabPage;
