import React from 'react';
import { getAllByRole, getAllByText, getByPlaceholderText, getByTestId, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LoginSignupConnected from '../../Login/Signup Components/LoginSignupConnected';
import App from '../../App';

describe('Login', () => {
    it('should render login page correctly', () => {
        const setAuth = vi.fn((boolean) => {
            return boolean;
        });

        const { getByTestId, getByText } = render(
            <MemoryRouter>
                <LoginSignupConnected setAuth={setAuth} />
            </MemoryRouter>
        );
        
        const actionValue = screen.getAllByText(/login/i);
        expect(actionValue.length).toBe(2);

        const email = screen.getByRole('textbox');
        expect(email).toBeInTheDocument();

        const password = screen.getByPlaceholderText(/password/i);
        expect(password).toBeInTheDocument();

        // screen.debug();
    });

    it('should have a warning message when users try to login without filling in all fields', async () => {
        const setAuth = vi.fn((boolean) => {
            return boolean;
        });

        render(
            <MemoryRouter>
                <LoginSignupConnected setAuth={setAuth} />
            </MemoryRouter>
        );

        const actionValue = screen.getAllByText(/login/i);

        const user = userEvent.setup();
        await user.click(actionValue[1]);

        const warningMsg = screen.getByText(/required fields/i);
        expect(warningMsg).toBeInTheDocument();

        // screen.debug();

    });
});

describe('SignUp', () => {
    it('should render sign up page correctly', async () => {
        const setAuth = vi.fn((boolean) => {
            return boolean;
        });

        const {getByTestId, getByText} = render(
            <MemoryRouter>
                <LoginSignupConnected setAuth={setAuth} />
            </MemoryRouter>
        );

        const switchButton = getByText('Sign Up');

        const user = userEvent.setup();
        await user.click(switchButton);

        const actionValue = screen.getAllByText('Sign Up');
        expect(actionValue.length).toBe(2);

        const password = screen.getByPlaceholderText('Password');
        expect(password).toBeInTheDocument();

        const name = screen.getByPlaceholderText(/Name/i);
        expect(name).toBeInTheDocument();

        const email = screen.getByPlaceholderText(/email/i);
        expect(email).toBeInTheDocument();

        const inputs = screen.getAllByRole('textbox');
        expect(inputs).toHaveLength(2);

        // screen.debug();
    });

    it('should have a warning message when users try to sign up without filling in all fields', async () => {
        const setAuth = vi.fn((boolean) => {
            return boolean;
        });

        render(
            <MemoryRouter>
                <LoginSignupConnected setAuth={setAuth} />
            </MemoryRouter>
        );

        const switchButton = screen.getByText('Sign Up');

        const user = userEvent.setup();
        await user.click(switchButton);

        const actionValue = screen.getAllByText(/sign up/i);
        await user.click(actionValue[1]);

        const warningMsg = screen.getByText(/required fields/i);
        expect(warningMsg).toBeInTheDocument();

        //screen.debug();

    });

    it('should navigate to login page with welcome message after correct sign up', async () => {
        const user = userEvent.setup();
        const setAuth = vi.fn((boolean) => {
            return boolean;
        });

        render(
            <MemoryRouter>
                <LoginSignupConnected setAuth={setAuth} />
            </MemoryRouter>
        );
        const signUpButton = screen.getByText(/sign up/i);
        await user.click(signUpButton);

        const nameInput = screen.getByPlaceholderText(/name/i);
        await user.type(nameInput, 'testing');

        const emailInput = screen.getByPlaceholderText(/email/i);
        await user.type(emailInput, 'testing@gmail');

        const passwordInput = screen.getByPlaceholderText(/password/i);
        await user.type(passwordInput, 'testing123');

        const actionValue = screen.getAllByText(/sign up/i);
        await user.click(actionValue[1]);

        const loginVals = screen.getAllByText(/login/i);
        expect(loginVals.length).toBe(2);

        const welcomeMsg = screen.getByText(/thank you/i);
        expect(welcomeMsg).toBeInTheDocument();

        screen.debug();
    })
})