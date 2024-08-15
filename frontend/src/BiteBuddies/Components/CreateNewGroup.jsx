import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchUsers from './SearchUsers';
import { toast } from 'react-toastify';
import "./CreateNewGroup.css"
import supabase from '../../FoodSearch/config/SupabaseClient';
import NotificationBackend from '../../apis/NotificationBackend';

const CreateNewGroup = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [name, setName] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        getUser();
        if (currentUser) {
            setGroupMembers([currentUser]);
        }
    }, []);


    async function getUser() {
        try {
            const response = await fetch("https://orbital-practice.vercel.app/homepage", {
                method: "GET", 
                headers: { token: localStorage.token }
            });
        
            const parseRes = await response.json();

            setName(parseRes.user_name);
            console.log("Name:", name); 

            const { data: userData, error: userDataError } = await supabase
                .from('users')
                .select('*')
                .eq('user_name', parseRes.user_name)
                .single();

            console.log("UserData:", userData);

            if (userDataError) {
                console.error('Error fetching user:', userDataError.message);
                throw userDataError;
            }

            setCurrentUser(userData); 
            console.log("CurrentUser:", currentUser);
            setGroupMembers([userData]);

        } catch (err) {
            console.error(err.message);
        }
    }

    const handleAddMember = (member) => {
        if (!groupMembers.some(m => m.user_id === member.user_id)) {
            setGroupMembers(prevMembers => [...prevMembers, member]);
        }
    };

    const handleRemoveMember = (member) => {
        if (member.user_id !== currentUser?.user_id) { // Check if currentUser is defined and then compare IDs
            setGroupMembers(prevMembers => prevMembers.filter(m => m.user_id !== member.user_id));
        } else {
            toast.error("You cannot remove yourself from the group.");
        }
    };

    const handleCreateGroup = async () => {
        console.log("Creating new group...");
        try {
            //if no group name
            if (!groupName) {
                toast.error("Please enter a group name!");
                return;
            }

            if (groupMembers.length < 2) {
                toast.error("Please add group members")
                return;
            }

            // Insert new group into 'chats' table
            const { data: newGroup, error: newGroupError } = await supabase
                .from('chats')
                .insert([{ chat_name : groupName, chat_desc : groupDesc, created_by: currentUser.user_id }])
                .select('*');

            if (newGroupError) throw newGroupError;

            const groupId = newGroup[0].chat_id;

            // Insert members into 'chat_users' table
            const { error: insertMembersError } = await supabase
                .from('chat_users')
                .insert(groupMembers.map(member => ({ chat_id: groupId, user_id: member.user_id })));

            if (insertMembersError) throw insertMembersError;
        

            // Create notifications for each member
            const otherMembers = groupMembers.filter(member => member.user_id !== currentUser.user_id);
            const notifMsg = `You have been added to a new group ${groupName}.`;
            const notifType = 'New Group Created';

            const response = await NotificationBackend.post("/", {
                groupMembers: otherMembers,
                notifMsg,
                notifType
            });
            // const notificationsPromises = groupMembers
            //     //.filter(member => member.user_id !== currentUser.user_id)
            //     .map(async member => {
            //         await NotificationBackend.post('/', {
            //             recipient_id: member.user_id,
            //             type: 'group_creation',
            //             message: `You have been added to a new group "${groupName}".`
            //         });
            //     });

            // await Promise.all(notificationsPromises);


            toast.success("Group created successfully!");
            navigate(`/bite-buddies`);
        } catch (err) {
            console.error(err.message);
            toast.error("Error creating group. Please try again.");
        }
    };


    return (
        <div>
        <div className="create-group-container">
            <button onClick={() => navigate("/bite-buddies")} className="back-button"><i className="fa-solid fa-chevron-left"></i></button>
            
            <div className='bb-header'>Create a new group!</div>

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

            <div className="groupDesc"> Group Description
            <input
                className='input'
                placeholder="Write a few words..."
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
            />
            </div>

            <div className='bb-header'>Selected Members:</div>

            <div className="group-members">
                {groupMembers.map((member, index) => (
                    <div className="group-member" key={index} onClick={() => handleRemoveMember(member)}>
                        {member.user_name}
                        {member.user_id !== currentUser?.user_id && (
                            // <button className="remove-member-btn" onClick={() => handleRemoveMember(member)}>
                            <div>
                                <i className='bx bx-x'></i>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
        <button onClick={handleCreateGroup}>Create New Group</button>
        </div>
    );
};

export default CreateNewGroup;
