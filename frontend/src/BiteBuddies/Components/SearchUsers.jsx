import React, { useState, useEffect } from 'react';
import supabase from '../../FoodSearch/config/SupabaseClient';

const SearchUsers = ({ groupMembers, currentUser, input, onAddMember }) => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        const { data, error } = await supabase.from('users').select('*');

        if (error) {
            console.error("Error fetching data: ", error);
        } else {
            setUserList(data);
        }
    };

    const filteredUserList = userList
        .filter((user) =>
            user.user_name.toLowerCase().includes(input.toLowerCase()) &&
            user.user_id !== currentUser.user_id && // Exclude current user
            !groupMembers.some(member => member.user_id === user.user_id) // Exclude members already in the group
        )
        .slice(0, 4);

    return (
        <div className="user-list">
            {filteredUserList.map((user) => (
                <div key={user.user_id} onClick={() => onAddMember(user)}>
                    {user.user_name}
                </div>
            ))}
        </div>
    );
};

export default SearchUsers;
