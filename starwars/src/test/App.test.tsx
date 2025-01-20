import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App Component Routing", () => {
    it("renders CharacterList component on default route", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText(/Star Wars Characters/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Search by name/i)).toBeInTheDocument();
    });

    it("renders CharacterDetails component on /character/:id route", () => {
        render(
            <MemoryRouter initialEntries={["/character/1"]}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading character details.../i)).toBeInTheDocument();
        expect(screen.getByText(/Back to Character List/i)).toBeInTheDocument();
    });

    it("renders FavouritesView component on /favourites route", () => {
        render(
            <MemoryRouter initialEntries={["/favourites"]}>
                <App />
            </MemoryRouter>
        );

        const favourites = screen.getAllByText(/Favourites/i); // Get all elements matching "Favourites"
        expect(favourites[1]).toBeInTheDocument(); // Assert that the second "Favourites" link is in the document
        expect(screen.getByText(/No favourites added yet!/i)).toBeInTheDocument();
    });

    it("displays the navigation link for Favourites", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <App />
            </MemoryRouter>
        );

        // Check for the Favourites link in the navigation
        const favouritesLink = screen.getByText(/Favourites/i);
        expect(favouritesLink).toBeInTheDocument();
        expect(favouritesLink.closest("a")).toHaveAttribute("href", "/favourites");
    });
});
