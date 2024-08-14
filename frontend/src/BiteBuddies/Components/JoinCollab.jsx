import React, { useState, useEffect } from 'react';
import './JoinCollab.css';
import supabase from '../../FoodSearch/config/SupabaseClient';

const JoinCollab = ({ currentUser, chatId , collabId, setIHaveCollabed, fetchCollabUsers }) => {
    const specialFilters = ['Halal', 'Vegetarian', 'Vegan'];
    const priceFilters = ['$', '$$', '$$$', '$$$$'];
    const cuisineFilters = ['Singaporean', 'Chinese', 'Western', 'Thai', 'Japanese', 'Korean'];
    const locationFilters = ['Bukit Timah', 'Yishun', 'Orchard', 'Kallang', 'Changi', 'Clementi', 'Bukit Merah', 'Toa Payoh', 'Hougang', 'Jurong'];

    //const [collabId, setCollabId] = useState(null);
    //const [currentUser, setCurrentUser] = useState(null);
    const [selectedRequirement, setSelectedRequirement] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        //getUser();
        //getCollabId();
    }, [collabId]);

    useEffect(() => {
        // Fetch options when selectedCategory changes
        if (selectedCategory) {
            fetchOptions(selectedCategory);
        }
    }, [selectedCategory]);

    /*const getUser = async () => {
        try {
            const response = await fetch("https://restaurant-roulette-backend.vercel.app/homepage", {
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
    };*/

    /*const getCollabId = async () => {
        try {
            const {data : collabData , error : collabError } = await supabase
                .from('chats')
                .select('active_collab_id')
                .eq('chat_id', chatId)
                .single();
        
            setCollabId(collabData.active_collab_id);
            console.log(collabData.active_collab_id);

            if (collabError) {
                throw collabError;
            }
        } catch (err) {
            throw err;
        }
    }*/

    const handleRestrictionChange = (e) => {
        setSelectedRequirement(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedOption('');
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data: collabData, error: collabError } = await supabase
                .from('join_collab')
                .insert([
                    {
                        collab_id: collabId,
                        user_id: currentUser.user_id,
                        restriction: selectedRequirement,
                        category: selectedCategory,
                        option: selectedOption
                    }
                ])
                .single()
                .select('*');

            if (collabError) {
                console.error('Error joining collab:', collabError.message);
                throw collabError;
            }

            console.log('Successfully joined collab:', collabData);
            console.log('Selected requirement:', selectedRequirement);
            console.log('Selected category:', selectedCategory);
            console.log('Selected option:', selectedOption);


            //prevent user from collabing again
            fetchCollabUsers();
            setIHaveCollabed(true);

        } catch (err) {
            console.error(err.message);
        }
    };

    const fetchOptions = (type) => {
        try {
            let fetchedOptions = [];

            if (type === "price") {
                fetchedOptions = priceFilters;
            } else if (type === "cuisine") {
                fetchedOptions = cuisineFilters;
            } else if (type === "location") {
                fetchedOptions = locationFilters;
            }

            setOptions(fetchedOptions);
        } catch (error) {
            console.error('Error fetching options:', error.message);
        }
    };

    return (
        <div className="join-collab-container">
            <h2>Join Collaboration</h2>

            <form onSubmit={handleSubmit}>
                <div className="collab-form">
                <div className="form-group">
                    <label htmlFor="restrictions">Select a dietary requirement:</label>
                    <select
                        id="restrictions"
                        className="form-control"
                        value={selectedRequirement}
                        onChange={handleRestrictionChange}
                        required
                    >
                        <option value="">Select a dietary requirement...</option>
                        <option value="NIL">NIL</option>
                        <option value="Halal">Halal</option>
                        <option value="Vegetarian">Vegetarian</option>
                        {/* <option value="Vegan">Vegan</option> */}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="categoryOptions">Select a category:</label>
                    <select
                        id="categoryOptions"
                        className="form-control"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        required
                    >
                        <option value="">Select a category...</option>
                        <option value="cuisine">Cuisine</option>
                        <option value="price">Price</option>
                        <option value="location">Location</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="collabOptions">Select an option:</label>
                    <select
                        id="collabOptions"
                        className="form-control"
                        value={selectedOption}
                        onChange={handleOptionChange}
                        required
                    >
                        <option value="">Select...</option>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default JoinCollab;
