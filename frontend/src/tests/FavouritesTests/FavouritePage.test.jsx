import { MemoryRouter } from "react-router-dom";
import FavouritePage from "../../Favourites/FavouritePage";
import { render, screen } from "@testing-library/react";
import Folders from "../../Favourites/Folders";
import userEvent from '@testing-library/user-event';

describe('Favourite Page', () => {
    it('should render favourite page correctly', () => {
        render(
            <MemoryRouter>
                <FavouritePage />
            </MemoryRouter>
        );
        
        const header = screen.getByRole('heading');
        expect(header).toBeInTheDocument();
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent(/add/i);

        //screen.debug();
    });

    it('should render the folders correctly', () => {
        const folders = [{folder_id: 1, folder_name: 'all'}, {folder_id: 2, folder_name: 'friends'}];
        render(
            <MemoryRouter>
                <Folders folders={folders} />
            </MemoryRouter>
        );

        const folder1 = screen.getByText(/all/i);
        expect(folder1).toBeInTheDocument();
        const folder2 = screen.getByText(/friend/i);
        expect(folder2).toBeInTheDocument();

        //screen.debug();
    });

    it('should render a pop up when the add button is clicked', async () => {
        render(
            <MemoryRouter>
                <FavouritePage />
            </MemoryRouter>
        );

        const addButton = screen.getByRole('button');
        const user = userEvent.setup();
        await user.click(addButton);

        const inputField = screen.getByRole('textbox');
        expect(inputField).toBeInTheDocument();

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(3);
        expect(buttons[2]).toHaveTextContent(/add/i);

        // screen.debug();
    });

    it('should render a warning message when user names folder All', async () => {
        render(
            <MemoryRouter>
                <FavouritePage />
            </MemoryRouter>
        );

        const addButton = screen.getByRole('button');
        const user = userEvent.setup();
        await user.click(addButton);

        const inputField = screen.getByRole('textbox');
        const buttons = screen.getAllByRole('button');
        await user.type(inputField, "All");
        expect(buttons[2]).toHaveTextContent("Add");
        expect(buttons[2]).not.toHaveTextContent(/folder/i);
        await user.click(buttons[2]);
        
        screen.debug();
    });
});