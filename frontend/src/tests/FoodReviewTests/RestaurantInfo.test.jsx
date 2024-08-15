import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RestaurantInfo from '../../FoodReview/RestaurantInfo';

describe('RestaurantInfo', () => {
    it('should render restaurant information correctly', () => {
        const restaurant = {rest_id: 1, rest_name: 'Wang Nasi Lemak Kukus', rest_location: 'Changi', rest_price: '$$', cuisine: 'Singaporean', special_conditions: 'Halal', image_url: 'url1', rest_address: '80 Airport Blvd', num_review: 3, average_star: 3.6};
        const setIsClick = vi.fn((boolean) => {
            return boolean;
        });
        const inFav = [];
        const favFolder =[];
        const setInFav = vi.fn((array) => {
            return array;
        });
        const addFavFolder = vi.fn((aFolder) => {
            setInFav([...favFolder, ...aFolder]);
        });
        const setIsAdding = vi.fn((boolean) => {
            return boolean;
        });
        
        render(
            <MemoryRouter>
                <RestaurantInfo oneRestaurant={restaurant} setIsClicked={setIsClick} inFav={inFav} setInFav={setInFav} addFavFolder={addFavFolder} setIsAdding={setIsAdding} />
            </MemoryRouter>
        );
        
        const heading = screen.getByRole('heading');
        expect(heading).toHaveTextContent(restaurant.rest_name);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', restaurant.image_url);
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(3);
        const removeButton = buttons[1];
        expect(removeButton).toHaveTextContent(/remove/i);
        expect(removeButton).toHaveAttribute('disabled');

        screen.debug();
    });
});