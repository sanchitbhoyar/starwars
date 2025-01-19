import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "./useDebounce";
import { useErrorBoundary } from "react-error-boundary";
import styles from './css/CharacterList.module.css'

interface Character {
    name: string;
    gender: string;
    homeworld: string;
    url: string;
}
interface ResultItem {
    uid: string;
    name: string;
    url: string;
}
interface ApiResponse {
    message: string;
    total_records: number;
    total_pages: number;
    previous: string | null;
    next: string | null;
    results: ResultItem[];
}

const API_URL = 'https://www.swapi.tech/api/people'
type DataDictionary = Record<string, any>;

const CharacterList: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoader] = useState(false);
    const debouncedSearchTerm = useDebounce(searchQuery, 500); // Debounce with a 500ms delay
    const isInitialLoad = React.useRef(true);
    const { showBoundary } = useErrorBoundary();

    const navigate = useNavigate();

    const fetchAllUrls = async (response: ApiResponse): Promise<DataDictionary> => {
        const urls = response.results.map((item) => ({ uid: item.uid, url: item.url }));

        const dataDictionary: DataDictionary = {};

        const fetchPromises = urls.map(async ({ uid, url }) => {
            try {
                const res = await fetch(url);
                const data = await res.json();
                dataDictionary[uid] = data.result.properties;
            } catch (error) {
                console.error(`Error fetching data for URL ${url}:`, error);
            }
        });

        await Promise.all(fetchPromises);

        return dataDictionary;
    };

    const fetchCharacters = async (page: number) => {
        setLoader(true);
        try {
            const response = await fetch(
                `${API_URL}?page=${page}&limit=10`
            );
            const data = await response.json();

            const dictionary = await fetchAllUrls(data);
            setCharacters(Object.values(dictionary) || []);
            setTotalPages(Math.ceil(data.total_records / 10));
        } catch (error) {
            console.error("Error fetching characters:", error);
            showBoundary(error);
        } finally {
            setLoader(false);
        }
    };

    const fetchSearchResult = async (searchQuery: string) => {
        setLoader(true);
        try {
            if (searchQuery.toLowerCase() === "error") {
                showBoundary(new Error("Error triggered for testing."))
            }
            const response = await fetch(
                `${API_URL}/?name=${searchQuery}`
            );
            const data = await response.json();
            setCharacters(data.result.map(x => x.properties) || []);
        } catch (error) {
            console.error("Error fetching characters:", error);
            showBoundary(error);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        fetchCharacters(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }

        if (debouncedSearchTerm.length >= 1) {
            fetchSearchResult(debouncedSearchTerm);
        } else {
            fetchCharacters(1);
        }
    }, [debouncedSearchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleCharacterClick = (url: string) => {
        const uid = url.split("/").pop();
        navigate(`/character/${uid}`);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Star Wars Characters</h1>
            <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
            {loading ? (
                <p className={styles.loadingMessage}>Loading characters...</p>
            ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Name</th>
                                <th className={styles.th}>Gender</th>
                                <th className={styles.th}>HomePlanet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {characters.map((character) => (
                                <tr
                                    key={character.url}
                                    onClick={() => handleCharacterClick(character.url)}
                                    className={styles.row}
                                >
                                    <td className={styles.td}>{character.name}</td>
                                    <td className={styles.td}>{character.gender}</td>
                                    <td className={styles.td}>{character.homeworld}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            {searchQuery.length <= 0 && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={styles.button}
                    >
                        Previous
                    </button>
                    <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className={styles.button}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CharacterList;
