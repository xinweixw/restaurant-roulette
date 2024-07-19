const router = require('express').Router(); 
const supabase = require('../database'); 
const authorisation = require('../middleware/authorisation');

// Get all notifications belonging to user
router.get('/api/notification', authorisation, async (req, res) => {
    try {
        const { data: notifData, error: notifError } = await supabase.from('notifications')
        .select('*')
        .eq('user_id', req.user)
        .order('notif_date', { ascending: false });

        if (notifError) throw notifError;

        res.status(200).json({
            status: "success",
            data: notifData
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Mark a notification as read 
router.put('/api/notification/:id', authorisation, async (req, res) => {
    try {
        const { data: updatedNotif, error: notifError } = await supabase.from('notifications')
        .update({ is_read: true })
        .eq('notif_id', req.params.id)
        .select();

        if (notifError) throw notifError;

        res.status(200).json({
            status: "success",
            data: {
                updatedNotif: updatedNotif[0],
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Delete a notification 
router.delete('/api/notification/:id', authorisation, async (req, res) => {
    try {
        const { data: delNotif, error: delNotifError } = await supabase.from('notifications')
        .delete()
        .eq('notif_id', req.params.id);

        if (delNotifError) throw delNotifError;

        res.status(204).json({
            status: "success"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Mark all notifications as read for user 
router.put('/api/notification', authorisation, async (req, res) => {
    try {
        const { data: allUpdatedNotif, error: notifError } = await supabase.from('notifications')
        .update({ is_read: true })
        .eq('user_id', req.user)
        .select();

        if (notifError) throw notifError; 

        res.status(200).json({
            status: "success",
            data: allUpdatedNotif
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Delete all notifications for user
router.delete('/api/notification', authorisation, async (req, res) => {
    try {
        const { data: delNotifs, error: notifError } = await supabase.from('notifications')
        .delete()
        .eq('user_id', req.user);

        if (notifError) throw notifError;

        res.status(204).json({
            status: "success"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

module.exports = router;