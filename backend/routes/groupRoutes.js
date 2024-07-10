const router = require('express').Router();
const supabase = require('../database');
const authorisation = require('../middleware/authorisation');

// Get all groups belonging to user
router.get('/group', authorisation, async (req, res) => {
    try {
        const { data: chatUsersData, error: chatUsersError } = await supabase
            .from('chat_users')
            .select('*')
            .eq('user_id', req.user.user_id);

        if (chatUsersError) throw chatUsersError;

        const groupIds = chatUsersData.map(chatUser => chatUser.chat_id);

        const { data: groupsData, error: groupsError } = await supabase
            .from('chats')
            .select('*')
            .in('chat_id', groupIds);

        if (groupsError) throw groupsError;

        res.status(200).json({
            status: 'success',
            results: groupsData.length,
            data: {
                groups: groupsData
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
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
            .insert([{ chat_name, created_by: req.user.user_id }])
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
