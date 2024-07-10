import './CreateNewGroup.css';
import { useNavigate } from 'react-router-dom';

const GroupPage = (props) => {
    const navigate = useNavigate();

    const handleAddMember = () => {
    }

    const handleStartCollab = () => {
    }

    return (
        <div className="Container" style={{height: '100vh' }}>
            <div className="GroupName">Group Name</div>
                <button onClick={handleAddMember}> Add Member </button>
                <button onClick={handleStartCollab}>Start Collaboration!</button>
        </div>
    );
};

export default GroupPage;
