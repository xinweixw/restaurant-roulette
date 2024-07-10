import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../FoodSearch/config/SupabaseClient';
import GroupTab from './Components/GroupTab';

const BiteBuddies = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await fetch("https://restaurant-roulette-backend.vercel.app/homepage", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            const currentUserId = parseRes.user_id;

            const { data: groupMembersData, error: groupMembersError } = await supabase
                .from('chat_users')
                .select('chat_id')
                .eq('user_id', currentUserId);

            if (groupMembersError) throw groupMembersError;

            const groupIds = groupMembersData.map(member => member.chat_id);

            const { data: groupsData, error: groupsError } = await supabase
                .from('chats')
                .select('*')
                .in('chat_id', groupIds);

            if (groupsError) throw groupsError;

            setGroups(groupsData);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewGroup = () => {
        navigate("/bite-buddies/create-new-group");
    };

    if (loading) {
        return (
            <h1 className="loadIcon">
                <i className="bx bx-loader-circle bx-spin" />
            </h1>
        );
    }

    return (
        <div className="Container">
            <div className="TopicName">Bite Buddies</div>
            <h1 className="header">Groups</h1>
            <button onClick={handleCreateNewGroup}>Create New Group</button>
            <div className="groups">
                {groups.map(group => (
                    <GroupTab key={group.chat_id} group={group} />
                ))}
            </div>
        </div>
    );
};

export default BiteBuddies;
