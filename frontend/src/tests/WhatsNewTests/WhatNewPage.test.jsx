import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import WhatsNewPage from "../../WhatsNew/WhatsNewPage";

describe('Whats New', () => {
    it('should render Whats New Page correctly', () => {
        render(
            <MemoryRouter>
                <WhatsNewPage />
            </MemoryRouter>
        );

        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(/new/i);

        screen.debug();
    });
})