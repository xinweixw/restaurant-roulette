import React from 'react';
import "./SearchAutofillKey.css";

export const SearchAutofillKey = ({ result, onSelect }) => {
    return (
        <div className="AutofillKey" onClick={() => onSelect(result.rest_name)}>
            {result.rest_name}
        </div>
    );
};
