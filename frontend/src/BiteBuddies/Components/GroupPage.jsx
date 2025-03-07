import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../../FoodSearch/config/SupabaseClient';
import JoinCollab from './JoinCollab';
import { toast } from 'react-toastify';
import Loading from '../../assets/Loading';
import GenerateRestaurant from './GenerateRestaurant';
import './GroupPage.css';
import StarRating from '../../FoodReview/StarRating';
import NotificationBackend from '../../apis/NotificationBackend';
import Popup from '../../Favourites/Popup';
import "../../assets/backButton.css";
import "../../FoodSearch/components/ResultRestaurant.css"

const GroupPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [groupName, setGroupName] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [collabUsers, setCollabUsers] = useState([]);
    const [currentGroup, setCurrentGroup] = useState({});
    const [activeCollaboration, setActiveCollaboration] = useState(false);
    const [collabId, setCollabId] = useState(null);
    const [iHaveCollabed, setIHaveCollabed] = useState(null);
    const [results, setResults] = useState(false);
    const [history, setHistory] = useState([]);
    const [restaurantList, setRestaurantList] = useState([]);

    // handle popup
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        fetchAllRestaurants();
    }, []);

    useEffect(() => {
        getUser();
        fetchGroupData();
        fetchGroupMembers();
        fetchHistory(); // Fetch collaboration history on component mount
    }, []);

    useEffect(() => {
        if (currentGroup) {
            checkActiveCollab();
            if (currentUser && activeCollaboration) {
                fetchCollabUsers();
            }
        }
    }, [currentGroup, activeCollaboration, currentUser]);

    const getUser = async () => {
        try {
            // Fetch current user data based on token
            const response = await fetch("https://orbital-practice.vercel.app/homepage", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();

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
    };

    const fetchGroupData = async () => {
        try {
            // Fetch group data based on group ID
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
            setGroupName(groupData.chat_name);

        } catch (err) {
            console.error(err.message);
        }
    };

    const fetchGroupMembers = async () => {
        try {
            // Fetch group members based on group ID
            const { data: membersData, error: membersError } = await supabase
                .from('chat_users')
                .select('*')
                .eq('chat_id', id);

            if (membersError) {
                console.error('Error fetching group members:', membersError.message);
                throw membersError;
            }

            // Fetch user data for each member
            const userIds = membersData.map(user => user.user_id);
            const usersPromises = userIds.map(userId => getUserData(userId));
            const usersData = await Promise.all(usersPromises);

            setGroupMembers(usersData);
            setLoading(false);

        } catch (err) {
            console.error('Error fetching group members:', err.message);
        }
    };

    const checkActiveCollab = () => {
        setActiveCollaboration(currentGroup.active_collaboration);
        if (currentGroup.active_collab_id) {
            setCollabId(currentGroup.active_collab_id);
        };
    };

    const handleStartCollab = async () => {
        try {
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
            const { data: updateResult, error: updateResultError } = await supabase
                .from('chats')
                .update({ active_collaboration: true, active_collab_id: collabData.collab_id })
                .eq('chat_id', id)
                .single();

            if (updateResultError) {
                console.error('Error updating active_collaboration in chats:', updateResultError.message);
                throw updateResultError;
            }

            setCollabId(collabData.collab_id);
            setCurrentGroup(updateResult);
            setActiveCollaboration(true);
            setIHaveCollabed(false);

            // Create notification for each member (excluding current user)
            const otherMembers = groupMembers.filter(member => member.user_id !== currentUser.user_id);
            const notifMsg = `A new collaboration has started in group ${groupName}.`;
            const notifType = 'New Collaboration Started';

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
            //             type: 'collab_start',
            //             message: `A new collaboration has started in group "${groupName}".`
            //         });
            //     });

            // await Promise.all(notificationsPromises);


            toast.success("Started Collaboration successfully!");

        } catch (error) {
            console.error('Error starting collaboration:', error.message);
        }
    };

    const handleEndCollab = async () => {
        try {
            if (!activeCollaboration) {
                console.log('Collaboration is not active');
                return;
            }

            // Delete the active collaboration entry
            const { data: collabData, error: collabError } = await supabase
                .from('active_collaborations')
                .delete()
                .eq('collab_id', collabId);

            // .match({ collab_id: collabId })
            // .single();

            if (collabError) {
                console.error('Error deleting collaboration:', collabError.message);
                throw collabError;
            }

            // Update 'chats' table to set active_collaboration to false
            const { data: updateResult, error: updateResultError } = await supabase
                .from('chats')
                .update({ active_collaboration: false, active_collab_id: null })
                .eq('chat_id', id)
                .single();

            if (updateResultError) {
                console.error('Error updating active_collaboration in chats:', updateResultError.message);
                throw updateResultError;
            }

            setActiveCollaboration(false);
            fetchGroupData();
            setResults(true);
            toast.success("Collaboration ended!");

        } catch (error) {
            console.error('Error ending collaboration:', error.message);
        }
    };

    const fetchAllRestaurants = async () => {
        try {
            const { data, error } = await supabase
                .from('restaurants_with_ratings')
                .select('*');

            if (error) {
                console.error("Error fetching data: ", error);
            } else {
                setRestaurantList(data);
            }

        } catch (err) {
            console.log(err.message);
        }
    };

    const fetchCollabUsers = async () => {
        try {
            if (!activeCollaboration) {
                console.log('Collaboration is not active');
                return;
            }

            // Fetch users that have already joined the collab
            const { data: joinedUsers, error: joinedUsersError } = await supabase
                .from('join_collab')
                .select('*')
                .eq('collab_id', collabId);

            if (joinedUsersError) {
                console.error('Error fetching joined users:', joinedUsersError.message);
                throw joinedUsersError;
            }

            if (!joinedUsers) {
                throw new Error('No users joined the collab');
            }

            // Check if current user is in the list of collab users
            const currentUserJoined = joinedUsers.some(user => user.user_id === currentUser.user_id);
            setIHaveCollabed(currentUserJoined);

            // Fetch additional user data for collabUsers
            const usersPromises = joinedUsers.map(user => getUserData(user.user_id));
            const usersData = await Promise.all(usersPromises);
            setCollabUsers(usersData);

            setLoading(false);

        } catch (err) {
            console.error('Error fetching collab users:', err.message);
        }
    };

    const getUserData = async (userId) => {
        try {
            // Fetch user data based on user ID
            const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                console.error(`Error fetching user data for user ID ${userId}:`, error.message);
                throw error;
            }

            return userData;
        } catch (err) {
            console.error('Error fetching user data:', err.message);
            throw err;
        }
    };

    const handleDeleteGroup = async () => {
        try {
            // Delete group in 'chats' table
            const { data: deleteGroup, error: deleteGroupError } = await supabase
                .from('chats')
                .delete()
                .eq("chat_id", id);

            if (deleteGroupError) throw deleteGroupError;

            // Delete members from 'chat_users' table
            const { error: deleteMembersError } = await supabase
                .from('chat_users')
                .delete()
                .eq("chat_id", id);

            if (deleteMembersError) throw deleteMembersError;

            toast.success("Group deleted successfully!");
            navigate(`/bite-buddies`);

        } catch (err) {
            console.error(err.message);
            toast.error("Error deleting group. Please try again.");
        }
    };

    const fetchHistory = async () => {
        try {
            // Fetch collaboration history based on group ID
            const { data: history, error: historyError } = await supabase
                .from("collab_history")
                .select("*")
                .eq("chat_id", id);

            if (historyError) {
                throw historyError;
            }

            setHistory(history);
            console.log(history);
        } catch (err) {
            console.error(err.message);
        }
    };

    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (loading) {
        return <Loading />;
    }

    if (results) {
        return <GenerateRestaurant id={id} collabId={collabId} restaurantList={restaurantList}
                                   setCollabId={setCollabId} setResults={setResults}/>;
    }

    return (
        <div>
        <div className="group-page-container">
            
            <button onClick={() => navigate("/bite-buddies")} className="back-button"><i className="fa-solid fa-chevron-left"></i></button>

            <div className="group-header">
                <div className="GroupSubHeader">
                    <div className="GroupName">{groupName}</div>
                </div>
                <div className="GroupMembers">Group Members: {groupMembers.map(user => user.user_name).join(', ')}</div>
            </div>

            {activeCollaboration ? (
                <div className="active-collab">
                    <h2>Collaboration has started!</h2>
                    <div className="collab-users-container">Users that have joined the collaboration:
                            <div className='collab-users'>
                                {collabUsers.map(user => user.user_name).join(', ')}
                            </div>
                    </div>

                <div className="underline" style={{width:"70%", margin: "10px"}}></div>

                    {iHaveCollabed ? (
                        <div>You have joined the collaboration!</div>
                    ) : (
                        <JoinCollab currentUser={currentUser} chatId={id} collabId={collabId} setIHaveCollabed={setIHaveCollabed} fetchCollabUsers={fetchCollabUsers}/>
                    )}

                <div className="underline" style={{width:"70%", margin: "10px"}}></div>

                <button onClick={handleEndCollab} style={{margin:"10px"}}>End Collaboration</button>

                </div>
            ) : (
                <div>
                    <button onClick={handleStartCollab} disabled={activeCollaboration}>
                        Start Collaboration!
                    </button>
                </div>
            )}

            {/* Display Collaboration History */}
            <div className="collab-history">
                <span>Collaboration History :</span>
                {history.length > 0 ? (
                    <div className="collab-history-container">
                        {history.map(collab => (
                            <div className="ResultRestaurantKey" onClick={() => onSelect(collab.rec_rest.rest_id)}>
                            <img src={collab.rec_rest.image_url} alt={collab.rec_rest.rest_name} className="restImage" />
                            <div className='row1'>
                                <div className="info-row">
                                    <div className="restName">{collab.rec_rest.rest_name}</div>
                                    <div className="rating"><StarRating stars={collab.rec_rest.average_star} /></div>
                                </div>
                                <div className="info-row">
                                    <div className="cuisine">
                                        <i className='bx bxs-bowl-rice'></i>
                                        {collab.rec_rest.cuisine}</div>
                                    <div className="priceRange">{collab.rec_rest.rest_price}</div>
                                </div>
                                <div className="info-row">
                                    <div className='location'>
                                        <i className='bx bx-map'></i>
                                        {collab.rec_rest.rest_location}</div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <span>No past collaborations.</span>
                )}
            </div>

            </div>
            {activeCollaboration ? null : (<button onClick={(e) => setIsClicked(true)}>Delete Group</button>)}
            <Popup isClicked={isClicked} setIsClicked={setIsClicked} >
                <div className="confirmDelete">
                    <span>Are you sure you want to delete this group?</span>
                    <br/>
                    <div className="button-group">
                        <button className="delete-btn" onClick={handleDeleteGroup}>Yes</button>
                        <button className="delete-btn" onClick={(e) => setIsClicked(false)}>No</button>
                    </div>
                </div>
            </Popup>
        </div>
    );
};

export default GroupPage;