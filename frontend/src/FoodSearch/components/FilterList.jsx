import React from 'react';
import "./FilterList.css";

export const FilterList = ({ selectedFilters, onSelectFilter }) => {
    const specialFilters = ['Halal', 'Vegetarian'];
    const priceFilters = ['$', '$$', '$$$', '$$$$'];
    const cuisineFilters = ['Singaporean', 'Chinese', 'Western', 'Thai', 'Japanese', 'Korean', 'Asian'];
    const locationFilters = ['Bukit Timah', 'Yishun', 'Orchard', 'Kallang', 'Changi', 'Clementi', 'Bukit Merah', 'Toa Payoh', 'Hougang', 'Jurong'];
    const newFilters = ['Newly Opened'];

    const handleFilterClick = (filter) => {
        onSelectFilter(filter);
    };

    return (
        <div className='filter-wrapper'>
            <div className="specialFilters">
            {/*special filters*/}
            {specialFilters.map((filter, id) => (
                <button 
                    className={`filter-button ${selectedFilters.includes(filter) ? 'selected' : ''}`}
                    key={id} 
                    onClick={() => handleFilterClick(filter)}
                >
                    {filter}
                </button>
            ))}
            </div>

            <div className="priceFilters">
            {/*price filters*/}
            {priceFilters.map((filter, id) => (
                <button 
                    className={`filter-button ${selectedFilters.includes(filter) ? 'selected' : ''}`}
                    key={id} 
                    onClick={() => handleFilterClick(filter)}
                >
                    {filter}
                </button>
            ))}
            </div>

            <div className="cuisineFilters">
            {/*cuisine filters*/}
            {cuisineFilters.map((filter, id) => (
                <button 
                    className={`filter-button ${selectedFilters.includes(filter) ? 'selected' : ''}`}
                    key={id} 
                    onClick={() => handleFilterClick(filter)}
                >
                    {filter}
                </button>
            ))}
            </div>

            <div className="locationFilters">
            {/* location filters */}
            {locationFilters.map((filter, id) => (
                <button 
                    className={`filter-button ${selectedFilters.includes(filter) ? 'selected' : ''}`}
                    key={id} 
                    onClick={() => handleFilterClick(filter)}
                >
                    {filter}
                </button>
            ))}
               
            </div>

            <div className="newFilters">
            {/*new restaurants filters*/}
            {newFilters.map((filter, id) => (
                <button 
                    className={`filter-button ${selectedFilters.includes(filter) ? 'selected' : ''}`}
                    key={id} 
                    onClick={() => handleFilterClick(filter)}
                >
                    {filter}
                </button>
            ))}
            </div>


        </div>
    );
};
