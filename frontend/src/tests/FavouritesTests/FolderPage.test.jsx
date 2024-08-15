import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import FolderPage from "../../Favourites/FolderPage";

describe('Folder Page', () => {
    it('should render the folder page correctly', () => {
        render(
            <MemoryRouter>
                <FolderPage />
            </MemoryRouter>
        );

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(1);
        screen.debug();
    });
});