import React, { useEffect, useState } from 'react';
import "./SearchResultsList.css";
import { ResultRestaurant } from './ResultRestaurant';

export const SearchResultsList = ({ input, results, onSelect }) => {
    const[searchMessage, setSearchMessage] = useState('');
    const [numResults, setNumResults] = useState(0);

    useEffect(() => {
        if (input) {
            setSearchMessage(`Search Results for ${input}`);
        } else {
            setSearchMessage("");
        }
        setNumResults(results.length);
    }, [results]);

    return (
        <div className='search-results-wrapper'>
            <div className="num-results-found-sign">
                <span>
                {searchMessage}
                </span>
                {numResults} Restaurants found
            </div>
            <div className="search-results-list">
                {results.map((result, id) => (
                    <ResultRestaurant result={result} key={id} onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
};
