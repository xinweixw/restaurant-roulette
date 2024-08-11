import React, { useState, useEffect } from 'react';
import "./BiteBuddiesPage.css";
import { useNavigate } from 'react-router-dom';
import supabase from '../FoodSearch/config/SupabaseClient';
import Loading from '../assets/Loading';
import BiteBuddiesBackend from '../apis/BiteBuddiesBackend';

const BiteBuddies = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [groupLoading, setGroupLoading] = useState(true);
    // const [name, setName] = useState("");
    // const [currentUser, setCurrentUser] = useState(null);
    // const [groups, setGroups] = useState([]);
    const [groupInfo, setGroupInfo] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await BiteBuddiesBackend.get("/groups", {
                    headers: {
                        token: token
                    }
                });
                setGroupInfo(response.data.data);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
                setGroupLoading(false);
            }
        }

        getData();
    }, []);
    
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

    if (loading || groupLoading) {
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
                <button onClick={handleSearch}><i className="fa-solid fa-magnifying-glass"></i></button>
                <button onClick={handleCreateNewGroup}>Create New Group</button>
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

            {/* <button onClick={handleCreateNewGroup}>Create New Group</button> */}

        </div>
    );
};

export default BiteBuddies;