const router = require('express').Router();
const supabase = require('../database');
const authorisation = require('../middleware/authorisation');

//get current user data
router.get('/api/bite-buddies/get-user', authorisation, async (req, res) => {
    try {
        const response = await fetch("https://restaurant-roulette-backend.vercel.app/homepage", {
            method: "GET", 
            headers: { token: localStorage.token }
          });
    
          const parseRes = await response.json();
          const userName = parseRes.user_name;
    
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('user_name', userName)
            .single();

        // req.user is a custom key of req object => in this case it's from createJWT req.body 
        res.status(200).json({
            status: 'success',
            results: user.length,
            data: {
                user: user[0]
            }
        });

    } catch (err) {
        console.error(err.message); 
        res.status(500).json("Server Error"); 
    }
}); 


// Get all groups belonging to user
router.get('/api/bite-buddies/group', authorisation, async (req, res) => {
    try {
        const { data: chatUsersData, error: chatUsersError } = await supabase
            .from('chat_users')
            .select('*')
            .eq('user_id', req.user);

        if (chatUsersError) {
            console.error('Error fetching chat_users:', chatUsersError.message);
            throw chatUsersError; // Throw error to handle in catch block
        }

        // Check if chatUsersData is empty or null
        if (!chatUsersData || chatUsersData.length === 0) {
            return res.status(200).json({
                status: 'success',
                results: 0,
                data: {
                    groups: []
                }
            });
        }

        const groupIds = chatUsersData.map(chatUser => chatUser.chat_id);

        if (groupIds.length === 0) {
            return res.status(200).json({
                status: 'success',
                results: 0,
                data: {
                    groups: []
                }
            });
        }

        const { data: groupsData, error: groupsError } = await supabase
            .from('chats')
            .select('*')
            .in('chat_id', groupIds);

        if (groupsError) {
            console.error('Error fetching groups:', groupsError.message);
            throw groupsError; // Throw error to handle in catch block
        }

        res.status(200).json({
            status: 'success',
            results: groupsData.length,
            data: {
                groups: groupsData
            }
        });
    } catch (err) {
        console.error('Internal server error:', err.message);
        res.status(500).json({ error: 'Server Error' }); // Return a JSON error response
    }
});


// Get details of a specific group
router.get('/group/:id', authorisation, async (req, res) => {
    try {
        const { data: chatData, error: chatError } = await supabase
            .from('chats')
            .select('*')
            .eq('chat_id', req.params.id);

        if (chatError) throw chatError;

        const { data: chatUsersData, error: chatUsersError } = await supabase
            .from('chat_users')
            .select('*')
            .eq('chat_id', req.params.id);

        if (chatUsersError) throw chatUsersError;

        res.status(200).json({
            status: 'success',
            data: {
                chat: chatData[0],
                members: chatUsersData
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

// Create a new group
router.post('/create-new-group', authorisation, async (req, res) => {
    const { chat_name, members } = req.body;

    try {
        // Insert new group into 'chats' table
        const { data: newGroup, error: newGroupError } = await supabase
            .from('chats')
            .insert([{ chat_name, created_by: req.user }])
            .select('*');

        if (newGroupError) throw newGroupError;

        const groupId = newGroup[0].chat_id;

        // Insert members into 'chat_users' table
        const { error: insertMembersError } = await supabase
            .from('chat_users')
            .insert(members.map(member => ({ chat_id: groupId, user_id: member.user_id })));

        if (insertMembersError) throw insertMembersError;

        res.status(201).json({
            status: 'success',
            data: {
                newGroup: newGroup[0]
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

module.exports = router;
