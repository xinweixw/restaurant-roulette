import React, { useState, useEffect } from 'react';
import "./BiteBuddiesPage.css";
import { useNavigate } from 'react-router-dom';
import supabase from '../FoodSearch/config/SupabaseClient';
import Loading from '../assets/Loading';

const BiteBuddies = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [groupLoading, setGroupLoading] = useState(true);
    const [name, setName] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [groupInfo, setGroupInfo] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUser(); // Fetch user data
            } catch (err) {
                console.error("Error fetching data:", err.message);
            } finally {
                setLoading(false); // Set loading to false after initial fetch
            }
        };
    
        fetchData();
    }, []); 

    useEffect(() => {
        if (currentUser) {
            fetchGroups(); // Fetch groups when currentUser changes
            fetchGroupInfo(); // Fetch group info when currentUser changes
        }
    }, [currentUser])
    

    async function getUser() {
        try {
            const response = await fetch("https://restaurant-roulette-backend.vercel.app/homepage", {
                method: "GET", 
                headers: { token: localStorage.token }
            });
        
            const parseRes = await response.json();
            setName(parseRes.user_name);

            const { data: userData, error: userDataError } = await supabase
                .from('users')
                .select('*')
                .eq('user_name', parseRes.user_name)
                .single();

            if (userDataError) {
                console.error('Error fetching user:', userDataError.message);
                throw userDataError;
            }

            setCurrentUser(userData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const fetchGroups = async () => {
        try {
            const { data: chatUsersData, error: chatUsersError } = await supabase
                .from('chat_users')
                .select('*')
                .eq('user_id', currentUser.user_id);

            if (chatUsersError) {
                console.error('Error fetching chat_users:', chatUsersError.message);
                throw chatUsersError;
            }
            
            setGroups(chatUsersData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const fetchGroupInfo = async () => {
        try {
            const { data: chatData, error: chatDataError } = await supabase
                .from('chats')
                .select('*')
                .in('chat_id', groups.map(group => group.chat_id));
    
            if (chatDataError) {
                console.error('Error fetching chat_info:', chatDataError.message);
                throw chatDataError;
            }
                
            setGroupInfo(chatData);
        } catch (err) {
            console.error(err.message);
        } finally {
            setGroupLoading(false); // Set groupLoading to false after fetching group info
        }
    }
    
    const handleCreateNewGroup = () => {
        navigate("/bite-buddies/create-new-group");
    };

    const handleSelectGroupTab = (id) => {
        navigate(`/bite-buddies/group/${id}`);
    };

    const handleSearch = () => {
        if (input.trim() === "") {
            setSearchResults([]);
            return;
        }

        const filteredGroups = groupInfo.filter(group => 
            group.chat_name.toLowerCase().includes(input.trim().toLowerCase())
        );

        setSearchResults(filteredGroups);
    };

    const clearInput = () => {
        setInput("");
        setSearchResults([]); // Clear search results
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="Container">
            <div className="TopicName">Bite Buddies</div>

            <h1 className="header">Groups</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search groups..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <button onClick={clearInput}>Show All Groups</button>

            <div className="groups">
                {groupLoading ? (
                    <Loading /> // Show loading indicator while group info is being fetched
                ) : (
                    <>
                        {searchResults.length > 0 ? (
                            searchResults.map(group => (
                                <div className="groupTabContainer" onClick={() => handleSelectGroupTab(group.chat_id)} key={group.chat_id}>
                                    <div className="groupName" key={`${group.chat_id}-name`}>
                                        {group.chat_name}
                                    </div>
                                </div>
                            ))
                        ) : (
                            groupInfo.length > 0 ? (
                                groupInfo.map(group => (
                                    <div className="groupTabContainer" onClick={() => handleSelectGroupTab(group.chat_id)} key={group.chat_id}>
                                        <div className="groupName" key={`${group.chat_id}-name`}>
                                            {group.chat_name}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div key="no-groups">No groups found.</div>
                            )
                        )}
                    </>
                )}
            </div>

            <button onClick={handleCreateNewGroup}>Create New Group</button>

        </div>
    );
};

export default BiteBuddies;
