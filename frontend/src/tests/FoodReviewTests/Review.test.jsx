import { getByLabelText, render, screen } from '@testing-library/react';
import Review from '../../FoodReview/Review';
import { RestaurantsContext } from '../../context/RestaurantsContext';
import { MemoryRouter } from 'react-router-dom';
import UpdateReview from '../../FoodReview/UpdateReview';
import AddReview from '../../FoodReview/AddReview';

// Mock context
const mockRestaurantContext = {
    revs: [
        { review_id: 1, user_id: 1, rest_id: 1, star: 4, review: 'Great food!', user_name: 'John'},
        { review_id: 2, user_id: 2, rest_id: 2, star: 3, review: 'Nice ambience', user_name: 'Sera'}
    ]
};

// Mock context provider
const MockContextProvider = ({ children }) => (
    <RestaurantsContext.Provider value={mockRestaurantContext}>
        {children}
    </RestaurantsContext.Provider>
);

describe('Review', () => {
    it('should render all reviews if any correcctly', () => {
        render(
            <MemoryRouter>
                <MockContextProvider>
                    <Review />
                </MockContextProvider>
            </MemoryRouter>
        ); 

        mockRestaurantContext.revs.forEach(rev => {
            const name = screen.getByText(rev.user_name);
            expect(name).toBeInTheDocument();
        });

        //screen.debug();
    });

    it('should render the Update Review Page correctly', () => {
        render(
            <MemoryRouter>
                <MockContextProvider>
                    <UpdateReview />
                </MockContextProvider>
            </MemoryRouter>
        );

        const selectInput = screen.getByRole('combobox');
        expect(selectInput).toBeInTheDocument();
        expect(selectInput).toHaveTextContent('Rating');

        const reviewBox = screen.getByRole('textbox');
        expect(reviewBox).toBeInTheDocument();

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(2);

        screen.debug();
    });

    it('should render the Add Review component correctly', () => {
        render(
            <MemoryRouter>
                <MockContextProvider>
                    <AddReview />
                </MockContextProvider>
            </MemoryRouter>
        );

        const selectInput = screen.getByRole('combobox');
        expect(selectInput).toBeInTheDocument();
        expect(selectInput).toHaveTextContent('Rating');

        const reviewText = screen.getByLabelText('Review');
        expect(reviewText).toBeInTheDocument();

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');

        screen.debug();
    });
})