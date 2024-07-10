import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../FoodSearch/config/SupabaseClient';
import SearchUsers from './SearchUsers';
import { toast } from 'react-toastify';

const CreateNewGroup = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            setGroupMembers([currentUser]);
        }
    }, [currentUser]);

    async function getUser() {
        try {
            const response = await fetch("https://restaurant-roulette-backend.vercel.app/homepage", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            const currentUserId = parseRes.user_id;
            const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', currentUserId)
                .single();

            if (error) {
                throw error;
            }

            setCurrentUser(userData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const handleCreateGroup = async (e) => {
        e.preventDefault();

        try {
            const { data: groupData, error: groupError } = await supabase
                .from('chats')
                .insert([{ chat_name: groupName, created_by: currentUser.user_id }])
                .select('*');

            if (groupError) throw groupError;

            const groupId = groupData[0].chat_id;

            const { error: insertMembersError } = await supabase
                .from('chat_users')
                .insert(groupMembers.map(member => ({ chat_id: groupId, user_id: member.user_id })));

            if (insertMembersError) throw insertMembersError;

            toast.success("Group created successfully!");
            navigate(`/bite-buddies`);
        } catch (err) {
            console.error(err.message);
            toast.error("Error creating group. Please try again.");
        }
    };

    const handleAddMember = (member) => {
        if (!groupMembers.some(m => m.user_id === member.user_id)) {
            setGroupMembers(prevMembers => [...prevMembers, member]);
        }
    };

    const handleRemoveMember = (member) => {
        if (member.user_id !== currentUser.user_id) { // Prevent removing current user
            setGroupMembers(prevMembers => prevMembers.filter(m => m.user_id !== member.user_id));
        } else {
            toast.error("You cannot remove yourself from the group.");
        }
    };

    return (
        <div className="Container">
            <div className="TopicName">Bite Buddies</div>

            <input
                className='input'
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
            />

            <input
                className='input'
                placeholder="Search for bite buddies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            {input && (
                <SearchUsers
                    groupMembers={groupMembers}
                    currentUser={currentUser}
                    input={input}
                    onAddMember={handleAddMember}
                />
            )}

            <div className="group-members">
                <h3>Selected Members:</h3>
                {groupMembers.map((member, index) => (
                    <div key={index}>
                        {member.user_name}
                        {member.user_id !== currentUser.user_id && (
                            <button onClick={() => handleRemoveMember(member)}>Remove</button>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={handleCreateGroup}>Create New Group</button>
        </div>
    );
};

export default CreateNewGroup;
