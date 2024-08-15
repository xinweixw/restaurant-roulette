import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import QuizPage from '../../RandomRestaurantGenerator/QuizPage';
import QuizQuestions from '../../RandomRestaurantGenerator/QuizQuestions';
import userEvent from '@testing-library/user-event';

describe('QuizPage', () => {
    it('should render the random restaurant generator page correctly', () => {
        render(
            <MemoryRouter>
                <QuizPage />
            </MemoryRouter>
        );

        const heading = screen.getByRole('heading');
        expect(heading).toHaveTextContent(/generator/i);
        
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(/start/i);

        //screen.debug();
    });

    it('should navigate to the quiz questions page on clicking the start quiz button', async () => {
        render(
            <MemoryRouter initialEntries={['/random-restaurant-generator']}>
                <Routes>
                    <Route path="/random-restaurant-generator" element={<QuizPage />} />
                    <Route path="/random-restaurant-generator/quiz-questions" element={<QuizQuestions />} />
                </Routes>
            </MemoryRouter>
        );

        const button = screen.getByRole('button');
        const user = userEvent.setup();
        await user.click(button);
        
        expect(screen.getByRole('heading')).toBeInTheDocument();

        // screen.debug();
    })
});

describe('QuizQuestions', () => {
    it('should render the quiz questions page correctly', () => {
        render(
            <MemoryRouter>
                <QuizQuestions />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading')).toBeInTheDocument();

        // const q1= await screen.findByText('Do you have any dietary restrictions?');
        // expect(q1).toBeInTheDocument();
        screen.debug();
    });

    // it('should render the quiz questions correctly', async () => {
    //     render(
    //         <MemoryRouter>
    //            <QuizQuestions /> 
    //         </MemoryRouter>
    //     );

    //     await waitFor(() => {
    //         expect(screen.queryByText('loading...')).not.toBeInTheDocument();
    //         //
    //     }, { timeout: 5000 });
        
    //     const q1 = await screen.findByText('Do you have any dietary restrictions?');
    //     expect(q1).toBeInTheDocument();

    //     //await expect(screen.queryByText('loading...')).not.toBeInTheDocument();
        
    //     // await screen.findByText('Do you have any dietary restrictions?');

    //     // expect(screen.getByText('Do you have any dietary restrictions?')).toBeInTheDocument();
    //     // expect(screen.getByText('Question 2')).toBeInTheDocument();
    //     screen.debug();
    // })
})