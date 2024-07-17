import React, { useState, useEffect } from 'react';
import supabase from '../../FoodSearch/config/SupabaseClient';
import BiteBuddiesBackend from '../../apis/BiteBuddiesBackend';

const JoinCollab = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [options, setOptions] = useState([]);

    useEffect(() => {
        console.log('Options updated:', options);
    }, [options]);

    const handleCategoryChange = async (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        console.log('Selected Category:', category);

        if (category === 'location') {
            const locationRes = await BiteBuddiesBackend.get("/location");
            const locations = locationRes.data.data;
            setOptions(locations.map(location => location.rest_location));
            console.log('Setting options to locations:', options);
            // setOptions(selectedLocation);
        } else if (category === 'price') {
            const priceRes = await BiteBuddiesBackend.get("/price");
            const prices = priceRes.data.data;
            setOptions(prices.map(price => price.rest_price));
            console.log('Setting options to prices:', options);
            // setOptions(selectedPrice);
        } else if (category === 'cuisine') {
            const cuisineRes = await BiteBuddiesBackend.get("/cuisine");
            const cuisines = cuisineRes.data.data;
            setOptions(cuisines.map(cuisine => cuisine.cuisine));
            console.log('Setting options to cuisines:', options);
            //setOptions(selectedCuisine);
        } else {
            setOptions([]);
        }
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted');
        console.log('Selected category:', selectedCategory);
        console.log('Selected option:', selectedOption);
    };

    return (
        <div className="container">
            <h2>Collaboration has started!</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="categoryOptions">Select a category:</label>
                    <select
                        id="categoryOptions"
                        className="form-select"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        required
                    >
                        <option value="" disabled>Select a category...</option>
                        <option value="cuisine">Cuisine</option>
                        <option value="price">Price</option>
                        <option value="location">Location</option>
                    </select>

                    <div>
                        <label htmlFor="collabOptions">Select an option:</label>
                        <select
                            id="collabOptions"
                            className="form-select"
                            value={selectedOption}
                            onChange={handleOptionChange}
                            required
                        >
                            <option value="">Select...</option>
                            {options.length > 0 && options.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default JoinCollab;