import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import supabase from '../../FoodSearch/config/SupabaseClient';
import JoinCollab from './JoinCollab';
import { toast } from 'react-toastify';

const GroupPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentGroup, setCurrentGroup] = useState({});
    const [activeCollaboration, setActiveCollaboration] = useState(false);
    const [collabId, setCollabId] = useState(null);

    useEffect(() => {
        fetchGroupData();
    }, [id]);

    useEffect(() => {
        checkActiveCollab();
    }, [currentGroup]);

    const fetchGroupData = async () => {
        try {
            const { data: groupData, error: groupError } = await supabase
                .from('chats')
                .select('*')
                .eq('chat_id', id)
                .single();

            if (groupError) {
                console.error('Error fetching group data:', groupError.message);
                throw groupError;
            }

            setCurrentGroup(groupData);
        } catch (err) {
            console.error(err.message);
        }
    };

    const checkActiveCollab = () => {
        setActiveCollaboration(currentGroup.active_collaboration);
    };

    const handleStartCollab = async () => {
        try {
            fetchGroupData();

            if (activeCollaboration) {
                console.log('Collaboration is already active');
                return;
            }

            // Insert new collaboration entry
            const { data: collabData, error: collabError } = await supabase
                .from('active_collaborations')
                .insert([{ chat_id: id }])
                .single()
                .select('*');

            if (collabError) {
                console.error('Error creating new collaboration:', collabError.message);
                throw collabError;
            }

            if (!collabData) {
                throw new Error('Inserted collaboration data is null');
            }

            // Update 'chats' table to set active_collaboration to true
            const { data: updateResult , error: updateResultError } = await supabase
                .from('chats')
                .update({ active_collaboration: true, active_collab_id: collabData.collab_id })
                .eq('chat_id', id)
                .select('*');

            if (updateResultError) {
                console.error('Error updating active_collaboration in chats:', updateResult.error.message);
                throw updateResult.error;
            }

            // Update local state
            setCollabId(collabData.collab_id);
            setCurrentGroup(updateResult);
            setActiveCollaboration(true);

            // Refresh page to reflect changes
            fetchGroupData();
            toast.success("Started Collaboration successfully!");

        } catch (error) {
            console.error('Error starting collaboration:', error.message);
        }
    };

    const handleEndCollab = async () => {
        try {
            // Check if collaboration is not active
            if (!activeCollaboration) {
                console.log('Collaboration is not active');
                return;
            }

            // Insert new collaboration entry
            const { data: collabData, error: collabError } = await supabase
                .from('active_collaborations')
                .delete()
                .match({ collab_id: currentGroup.active_collab_id })
                .single();

            if (collabError) {
                console.error('Error deleting collaboration:', collabError.message);
                throw collabError;
            }

            // Update 'chats' table to set active_collaboration to false
            const { data: updateResult , error: updateResultError } = await supabase
                .from('chats')
                .update({ active_collaboration: false, active_collab_id: null })
                .eq('chat_id', id);

            if (updateResultError) {
                console.error('Error updating active_collaboration in chats:', error.message);
                throw error;
            }

            setActiveCollaboration(false);
            fetchGroupData();
            toast.success("Collaboration ended!");
        } catch (error) {
            console.error('Error ending collaboration:', error.message);
        }
    };

    return (
        <div className="Container" style={{ height: '100vh' }}>
            <div className="GroupName">Group Name: {currentGroup.chat_name}</div>

            {activeCollaboration ? (
                <div>
                    <button onClick={handleEndCollab}>End Collaboration</button>
                    <JoinCollab/>
                </div>
            ) : (
                <div>
                    <button onClick={handleStartCollab} disabled={activeCollaboration}>
                        Start Collaboration!
                    </button>
                </div>
            )}

            <div>
                <span>Collaboration History</span>
            </div>
        </div>
    );
};

export default GroupPage;
