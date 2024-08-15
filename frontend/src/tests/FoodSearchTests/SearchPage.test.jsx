import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchPage from '../../FoodSearch/SearchPage';

describe('SearchPage', () => {
    it('should render the search page correctly', () => {
        render(
            <MemoryRouter>
                <SearchPage />
            </MemoryRouter>
        );

        const searchBar = screen.getByRole('textbox');
        expect(searchBar).toBeInTheDocument();

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(26);

        const restaurantsFound = screen.getByText(/found/i);
        expect(restaurantsFound).toBeInTheDocument();

        screen.debug();
    })
})