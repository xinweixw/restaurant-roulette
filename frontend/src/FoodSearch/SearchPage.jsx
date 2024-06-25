import { useState, useEffect } from 'react';
import './SearchPage.css';
import supabase from "./config/SupabaseClient";
import { SearchBar } from './components/SearchBar';
import { SearchAutofill } from './components/SearchAutofill';
import { SearchResultsList } from './components/SearchResultsList';
import { FilterList } from './components/FilterList';
import { useNavigate } from 'react-router-dom';

const specialFilters = ['Halal', 'Vegetarian', 'Vegan'];
const priceFilters = ['$', '$$', '$$$', '$$$$'];
const cuisineFilters = ['Singaporean', 'Chinese', 'Western', 'Thai', 'Japanese', 'Korean'];

const SearchPage = () => {
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [input, setInput] = useState("");
    const [showAutofill, setShowAutofill] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllRestaurants();
    }, []);

    const fetchAllRestaurants = async () => {
        const { data, error } = await supabase.from('restaurants').select('*');
        if (error) {
            console.error("Error fetching data: ", error);
        } else {
            setResults(data);
            setFilteredResults(data);
        }
    };

    const fetchFilteredRestaurants = async () => {
        let query = supabase.from('restaurants').select('*');

        if (selectedFilters.length > 0) {
            const specialConditions = selectedFilters.filter(filter => specialFilters.includes(filter));
            const priceConditions = selectedFilters.filter(filter => priceFilters.includes(filter));
            const cuisineConditions = selectedFilters.filter(filter => cuisineFilters.includes(filter));

            if (specialConditions.length > 0) {
                query = query.in('special_conditions', specialConditions);
            }
            if (priceConditions.length > 0) {
                query = query.in('rest_price', priceConditions);
            }
            if (cuisineConditions.length > 0) {
                query = query.in('cuisine', cuisineConditions);
            }
        }

        if (input) {
            query = query.or(`rest_name.ilike.%${input}%,rest_location.ilike.%${input}%,cuisine.ilike.%${input}%`);
        }

        const { data, error } = await query;
        if (error) {
            console.error("Error fetching data: ", error);
        } else {
            setFilteredResults(data);
        }
    };

    const handleSearch = () => {
        fetchFilteredRestaurants();
        setShowAutofill(false);
        setIsReadOnly(true);
    };

    const handleAutofill = (value) => {
        setInput(value);
        handleSearch();
    };

    const handleSelectRestaurant = (id) => {
        navigate(`/restaurants/${id}`);
        console.log(`Navigating to restaurant page with ID: ${id}`);
    };

    const handleSelectFilter = (filter) => {
        const updatedFilters = selectedFilters.includes(filter)
            ? selectedFilters.filter(f => f !== filter)
            : [...selectedFilters, filter];

        setSelectedFilters(updatedFilters);
        setShowAutofill(false);
        setIsReadOnly(false);
    };

    useEffect(() => {
        if (!input && selectedFilters.length === 0) {
            setFilteredResults(results);
        } else {
            fetchFilteredRestaurants();
        }
    }, [selectedFilters, input, results]);

    return (
        <div className="App">
            <div className="AppLogo">Restaurant Roulette</div>
            <div className="search-bar-container">
                <SearchBar 
                  handleSearch={handleSearch}
                  setResults={setResults} 
                  input={input} 
                  setInput={setInput} 
                  setShowAutofill={setShowAutofill}
                  isReadOnly={isReadOnly}
                  setIsReadOnly={setIsReadOnly}
                />
                {showAutofill && input && (
                    <SearchAutofill 
                        results={results} 
                        input={input} 
                        onSelect={handleAutofill} 
                    />
                )}
                <FilterList selectedFilters={selectedFilters} onSelectFilter={handleSelectFilter} />
                <SearchResultsList results={filteredResults} onSelect={handleSelectRestaurant} />
            </div>
        </div>
    );
};

export default SearchPage;
