import React from 'react';
import "./SearchAutofill.css";
import { SearchAutofillKey } from './SearchAutofillKey';

export const SearchAutofill = ({ results, input, onSelect }) => {
    const filteredResults = results
        .filter((result) =>
            result.rest_name.toLowerCase().includes(input.toLowerCase()) ||
            result.rest_location.toLowerCase().includes(input.toLowerCase()) ||
            result.cuisine.toLowerCase().includes(input.toLowerCase())
        )
        .sort((a, b) => a.rest_name.localeCompare(b.rest_name))
        .slice(0,4);

    return (
        <div className="autofill-list">
            {filteredResults.map((result, id) => (
                <SearchAutofillKey result={result} key={id} onSelect={onSelect} />
            ))}
        </div>
    );
};
