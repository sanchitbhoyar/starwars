import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FavouritesView from "../FavouritesView";

// Define the mock function for navigation
const navigateMock = vi.fn();

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock, // Return the mock navigate function
    };
});

describe("FavouritesView Component", () => {
    beforeEach(() => {
        navigateMock.mockClear(); // Clear any previous calls to the mock
        localStorage.clear(); // Clear localStorage to ensure isolation
    });

    it("renders 'No favourites added yet!' when no favourites exist", () => {
        render(
            <MemoryRouter>
                <FavouritesView />
            </MemoryRouter>
        );
        expect(screen.getByText(/No favourites added yet!/i)).toBeInTheDocument();
    });

    it("renders a list of favourite characters when stored in localStorage", () => {
        const favourites = [
            {
                id: "1",
                name: "Luke Skywalker",
                height: "172",
                gender: "Male",
                homeworld: "Tatooine",
            },
        ];
        localStorage.setItem("favorites", JSON.stringify(favourites));

        render(
            <MemoryRouter>
                <FavouritesView />
            </MemoryRouter>
        );

        expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    });

    it("removes a character from favourites when 'Remove' is clicked", () => {
        const favourites = [
            {
                id: "1",
                name: "Luke Skywalker",
                height: "172",
                gender: "Male",
                homeworld: "Tatooine",
            },
        ];
        localStorage.setItem("favorites", JSON.stringify(favourites));

        render(
            <MemoryRouter>
                <FavouritesView />
            </MemoryRouter>
        );

        const removeButton = screen.getByText(/Remove/i);
        fireEvent.click(removeButton);

        expect(screen.queryByText("Luke Skywalker")).not.toBeInTheDocument();
        expect(localStorage.getItem("favorites")).toBe("[]");
    });

    it("navigates back to the previous page when 'Back' button is clicked", () => {
        render(
            <MemoryRouter>
                <FavouritesView />
            </MemoryRouter>
        );

        const backButton = screen.getByText(/Back/i);
        fireEvent.click(backButton);

        expect(navigateMock).toHaveBeenCalledWith(-1);
    });
});
