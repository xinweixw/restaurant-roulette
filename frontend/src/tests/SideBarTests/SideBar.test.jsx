import { getAllByRole, render, screen, within } from '@testing-library/react';
import SideBar from '../../SideBar/SideBar';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('SideBar', () => {
    it('should render the sidebar correctly', async () => {
        const setAuth = vi.fn((boolean) => {
            return boolean;
        });

        render(
            <MemoryRouter>
                <SideBar setAuth={setAuth} />
            </MemoryRouter>
        );

        const name = await screen.findByText('Test1'); 
        expect(name).toBeInTheDocument();
        const listOfNav = screen.getByRole('list'); 
        const { getAllByRole } = within(listOfNav);
        const items = getAllByRole("listitem");
        expect(items.length).toBe(7);
        screen.debug(); 
    });
});

// describe('SideBarNavigation', () => {
//     it('should navigate to the signup-login when the logout is clicked', () => {
//         const setAuth = vi.fn((boolean) => {
//             return boolean;
//         });

//         render(
//             <MemoryRouter>
//                 <SideBar setAuth={setAuth} />
//             </MemoryRouter>
//         ); 

//         // const user = userEvent.setup();
//         const logoutLink = screen.getAllByText(/Logout/i);
//         userEvent.click(logoutLink[0])
//         expect(window.location.pathname).toBe("/");
//         screen.debug();
//     });
// })