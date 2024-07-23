import React, { useState, useEffect } from 'react';
import './JoinCollab.css';
import supabase from '../../FoodSearch/config/SupabaseClient';

const JoinCollab = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        // fetch options when selectedCategory changes
        if (selectedCategory) {
            fetchOptions(selectedCategory);
        }
    }, [selectedCategory]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedOption('');
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Selected category:', selectedCategory);
        console.log('Selected option:', selectedOption);
    };

    const fetchOptions = async (type) => {
        try {
            // Fetch unique options based on the selected category
            const { data, error } = await supabase
                .from('bite_buddies_quiz')
                .select(type);
    
            if (error) {
                console.error('Error fetching options:', error.message);
                throw error;
            }
    
            const options = data.map(item => item[type]);
    
            console.log('Unique options:', options);
            setOptions(options);
        } catch (error) {
            console.error('Error fetching options:', error.message);
        }
    };
    

    return (
        <div className="Container">
            <h2>Collaboration has started!</h2>
            
            <form-select onSubmit={handleSubmit} type="text">
                <div className="form-group">
                    <label htmlFor="categoryOptions">Select a category:</label>
                    <select
                        id="categoryOptions"
                        className="form-control"
                        value={selectedCategory}
                        onChange={(e) => {handleCategoryChange(e)}}
                        required
                    >
                        <option value="">Select a category...</option>
                        <option value="cuisine">Cuisine</option>
                        <option value="price">Price</option>
                        <option value="location">Location</option>
                    </select>

                    
                        <div>
                            <label htmlFor="collabOptions">Select an option:</label>
                            <select
                                id="collabOptions"
                                className="form-control"
                                value={selectedOption}
                                onChange={(e) => {handleOptionChange(e)}}
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
                <button type="submit" className="btn btn-primary">Submit</button>
            </form-select>
        </div>
    );
};

export default JoinCollab;
