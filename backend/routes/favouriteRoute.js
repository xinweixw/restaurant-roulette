const router = require('express').Router(); 
const supabase = require('../database'); 
const authorisation = require('../middleware/authorisation');

// Get all folders belonging to user
router.get('/api/favourites', authorisation, async (req, res) => {
    try {
        const { data: foldersData, error: foldersError } = await supabase.from('fav_folders')
        .select('*')
        .eq('user_id', req.user); 

        if (foldersError) throw foldersError;

        res.status(200).json({
            status: "success",
            results: foldersData.length,
            data: {
                folders: foldersData,
            }
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Get a folder
router.get('/api/favourites/:id', authorisation, async (req, res) => {
    try {
        const { data: folder, error: folderError } = await supabase.from('fav_folders')
            .select('*')
            .eq('folder_id', req.params.id);

        if (folderError) throw folderError;

        const { data: favRestData, error: favRestError } = await supabase.from('fav_folders_with_restaurants')
        .select('*')
        .eq('folder_id', req.params.id);

        if (favRestError) throw favRestError;

        res.status(200).json({
            status: "success",
            data: {
                folder: folder[0],
                restaurants: favRestData
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Create a new folder
router.post('/api/favourites', authorisation, async (req, res) => {
    try {
        const { data: newFolder, error: newFolderError } = await supabase.from('fav_folders')
        .insert({ folder_name: req.body.folder_name, user_id: req.user })
        .select();

        if (newFolderError) throw newFolderError;

        res.status(201).json({
            status: "success",
            data: {
                folder: newFolder[0]
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Edit a folder
router.put('/api/favourites/:id', authorisation, async (req, res) => {
    try {
        // 1. Check if the folder is an 'All' folder
        const { data: current_folder } = await supabase.from('fav_folders')
        .select('*')
        .eq('folder_id', req.params.id);

        const curr_folder_name = current_folder[0].folder_name;

        if (curr_folder_name === "All") {
            return res.status(401).json("You cannot edit this folder"); 
        };
        
        // 2. Update the folder
        const { data: updatedFolder, error: folderError } = await supabase.from('fav_folders')
        .update({ folder_name: req.body.folder_name })
        .eq('folder_id', req.params.id)
        .select();

        if (folderError) throw folderError; 

        res.status(200).json({
            status: "success", 
            data: {
                folder: updatedFolder[0],
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Delete a folder 
router.delete('/api/favourites/:id', authorisation, async (req, res) => {
    try {
        // 1. Check if folder is an 'All' folder
        const { data: current_folder } = await supabase.from('fav_folders')
        .select('*')
        .eq('folder_id', req.params.id);

        const curr_folder_name = current_folder[0].folder_name;

        if (curr_folder_name === "All") {
            return res.status(401).json("You cannot edit this folder"); 
        };

        // 2. Delete the folder
        const { data: deletedFolder, error: folderError } = await supabase.from('fav_folders')
        .delete()
        .eq('folder_id', req.params.id);

        res.status(204).json({
            status: "success"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Add a restaurant to folder

// Delete a restaurant from a folder
router.delete('/api/favourites/:id/restaurant/:restid', authorisation, async (req, res) => {
    try {
        const { data: deletedRestaurant, error: delError } = await supabase.from('fav_restaurants')
        .delete()
        .eq('folder_id', req.params.id)
        .eq('rest_id', req.params.restid)
        .select(); 

        if (delError) throw delError;

        res.status(204).json({
            status: "sucess",
            data: {
                restaurant: deletedRestaurant,
            }, 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

// Add a restaurant to folder(s) (need check if restaurant already in folder)
router.post('/api/restaurants/:id/favourite', authorisation, async (req, res) => {
    try {
        const { folders } = req.body;
        const { data: addedRestaurant, error: restaurantError } = await supabase.from('fav_restaurants')
        .insert(folders.map(folder_id => ({ folder_id, rest_id: req.params.id })))
        .select();

        if (restaurantError) throw restaurantError;

        res.status(201).json({
            status: "success",
            data: {
                fav: addedRestaurant,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Delete a restaurant from folder(s)
router.delete('/api/restaurants/:id/favourite', authorisation, async (req, res) => {
    try {
        // 1. Get all fav folders from user
        const { data: foldersData, error: foldersError } = await supabase.from('fav_folders')
        .select('folder_id')
        .eq('user_id', req.user);

        // Object.keys(folder).map((key) => folder[key])
        const folders = foldersData.flatMap(folder => Object.keys(folder).map((key) => folder[key]));

        // 2. Delete restaurants from folders
        const { data: delRestaurant, error: delRestaurantError } = await supabase.from('fav_restaurants')
        .delete()
        .eq('rest_id', req.params.id)
        .in('folder_id', folders)
        .select();

        if (delRestaurantError) throw delRestaurantError;

        res.status(204).json({
            status: "success",
            data: {
                delRestaurant: delRestaurant
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Get all folder(s) that have not favourited a restaurant
router.get('/api/restaurants/:id/favourite', authorisation, async (req, res) => {
    try {
        // 1. Get all folders that contains the restaurant
        const { data: faved, error: favedError } = await supabase.from('fav_restaurants_with_users')
        .select('folder_id')
        .eq('user_id', req.user)
        .eq('rest_id', req.params.id); 

        if (favedError) throw favedError;

        const { data: wholeFaved, error: wfavedError } = await supabase.from('fav_restaurants_with_users')
        .select('*')
        .eq('user_id', req.user)
        .eq('rest_id', req.params.id); 

        if (wfavedError) throw wfavedError;

        // 2. Get the folder_ids of these folders
        const favedFolderId = faved.map(f => f.folder_id);

        // 3. Get all folders that do not contain the restaurant
        const { data: noRestaurantFolder, error: folderError } = await supabase.from('fav_folders')
        .select('*')
        .not('folder_id', 'in', `(${favedFolderId.join(',')})`)
        .eq('user_id', req.user);

        if (folderError) throw folderError;

        res.status(200).json({
            status: "success",
            data: {
                notFav: noRestaurantFolder,
                fav: wholeFaved
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Get all folder(s) that have favourited a restaurant
// router.get('/api/restaurants/:id/infavourite', authorisation, async (req, res) => {
//     try {
//         const { data: faved, error: favedError } = await supabase.from('fav_restaurants_with_users')
//         .select('*')
//         .eq('user_id', req.user)
//         .eq('rest_id', req.params.id); 

//         if (favedError) throw favedError;

//         res.status(200).json({
//             status: "success",
//             data: {
//                 fav: faved
//             }
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json("Server Error");
//     }
// });

module.exports= router;