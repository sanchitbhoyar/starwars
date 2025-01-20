import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import CharacterList from "../CharacterList";
import { BrowserRouter } from "react-router-dom"; // For `useNavigate`
import '@testing-library/jest-dom';

const mockCharacters = [
    {
        height: "172",
        mass: "77",
        hair_color: "blond",
        skin_color: "fair",
        eye_color: "blue",
        birth_year: "19BBY",
        gender: "male",
        name: "Luke Skywalker",
        homeworld: "https://www.swapi.tech/api/planets/1",
        url: "https://www.swapi.tech/api/people/1",
    },
    {
        height: "167",
        mass: "75",
        hair_color: "n/a",
        skin_color: "gold",
        eye_color: "yellow",
        birth_year: "112BBY",
        gender: "n/a",
        name: "C-3PO",
        homeworld: "https://www.swapi.tech/api/planets/1",
        url: "https://www.swapi.tech/api/people/2",
    },
];

describe.skip("CharacterList Component", () => {
    vi.mock("react-error-boundary", () => ({
        useErrorBoundary: () => ({
            showBoundary: vi.fn(),
        }),
    }));
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("fetches and displays a list of characters", async () => {
        (fetch as vi.Mock).mockResolvedValueOnce({
            json: async () => ({
                total_records: 2,
                total_pages: 1,
                results: mockCharacters.map((char) => ({
                    uid: char.url.split("/").pop(),
                    name: char.name,
                    url: char.url,
                })),
            }),
        });

        (fetch as vi.Mock).mockResolvedValueOnce({
            json: async () => ({
                result: {
                    properties: mockCharacters[0],
                },
            }),
        });

        (fetch as vi.Mock).mockResolvedValueOnce({
            json: async () => ({
                result: {
                    properties: mockCharacters[1],
                },
            }),
        });

        render(
            <BrowserRouter>
                <CharacterList />
            </BrowserRouter>
        );

        expect(screen.getByText(/loading characters/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
            expect(screen.getByText("C-3PO")).toBeInTheDocument();
        });

        expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
        expect(screen.getByText("C-3PO")).toBeInTheDocument();
    });

    it.skip("handles search functionality", async () => {
        (fetch as vi.Mock).mockResolvedValueOnce({
            json: async () => ({
                result: [
                    {
                        properties: mockCharacters[0],
                    },
                ],
            }),
        });

        render(
            <BrowserRouter>
                <CharacterList />
            </BrowserRouter>
        );

        const searchInput = screen.getByPlaceholderText(/search by name/i);
        fireEvent.change(searchInput, { target: { value: "Luke" } });

        await waitFor(() => {
            expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
        });

        expect(screen.queryByText("C-3PO")).not.toBeInTheDocument();
    });

    it("navigates to character details on row click", async () => {
        (fetch as vi.Mock).mockResolvedValueOnce({
            json: async () => ({
                total_records: 2,
                total_pages: 1,
                results: mockCharacters.map((char) => ({
                    uid: char.url.split("/").pop(),
                    name: char.name,
                    url: char.url,
                })),
            }),
        });

        render(
            <BrowserRouter>
                <CharacterList />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Luke Skywalker"));

        expect(window.location.pathname).toBe("/character/1");
    });
});
