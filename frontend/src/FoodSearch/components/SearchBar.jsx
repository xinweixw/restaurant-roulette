import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = ({ handleSearch, input, setInput, setShowAutofill , setIsReadOnly, isReadOnly}) => {

    const handleChange = (value) => {
        setInput(value);
    };

    const handleInputClick = () => {
        setIsReadOnly(false); // Allow input to be editable when clicked
        setShowAutofill(true); // Shows autofill
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch(input);
        }
    };

    return (
        <div className="input-wrapper">
            <input className='input'
                placeholder="Search restaurant name, cuisine, or location..."
                value={input}
                readOnly={isReadOnly}
                onChange={(e) => handleChange(e.target.value)}
                onClick={handleInputClick} // Make input editable on click
                onKeyDown={handleKeyPress} // Enter key press triggers search button
            />
            <button onClick={handleSearch} className="search-button">
                <FaSearch id="search-icon" />
            </button>
        </div>
    );
};
