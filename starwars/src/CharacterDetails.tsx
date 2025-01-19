import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import styles from './css/CharacterDetails.module.css'

interface CharacterDetails {
    name: string;
    hair_color: string;
    eye_color: string;
    gender: string;
    homeworld: string;
    films: string[];
    starships: string[];
}

interface Film {
    properties: {
        title: string;
        characters: string[];
    };
}

interface Starship {
    properties: {
        name: string;
    };
}

interface Favorite {
    id: string;
    name: string | undefined;
}

const CharacterDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [character, setCharacter] = useState<CharacterDetails | null>(null);
    const [homeworld, setHomeworld] = useState<string>("");
    const [films, setFilms] = useState<string[]>([]);
    const [starships, setStarships] = useState<string[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);

    const characterDetailUrl = `https://www.swapi.tech/api/people/${id}`;

    const navigate = useNavigate();
    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await fetch(characterDetailUrl);
                const data = await response.json();
                setCharacter(data.result.properties);

                const homeworldResponse = await fetch(data.result.properties.homeworld);
                const homeworldData = await homeworldResponse.json();
                setHomeworld(homeworldData.result.properties.name);

                const filmsResponse = await fetch("https://www.swapi.tech/api/films");
                const filmsData: { result: Film[] } = await filmsResponse.json();

                const titles = filmsData.result
                    .filter((film) => film.properties.characters.includes(characterDetailUrl))
                    .map((film) => film.properties.title);
                setFilms(titles);
                // data.result.properties.starships = ["https://www.swapi.tech/api/starships/12/"]; // curently not returned by people API
                // let a = ["https://www.swapi.tech/api/starships/12/", "https://www.swapi.tech/api/starships/9/", "https://www.swapi.tech/api/starships/3/",]
                const starshipsData = data.result.properties.starships ? await Promise.all(
                    data.result.properties.starships.map(async (starshipUrl: string) => {
                        const starshipResponse = await fetch(starshipUrl);
                        const starshipData: { result: Starship } = await starshipResponse.json();
                        return starshipData.result.properties.name;
                    })
                ) : [];
                setStarships(starshipsData as string[]);
            } catch (error) {
                console.error("Error fetching character details:", error);
                showBoundary(error);
            }
        };

        fetchCharacter();
    }, [id]);

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        if (isFavorite) {
            const updatedFavorites = favorites.filter((fav: any) => fav.id !== id);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        } else {
            const newFavorite = {
                id,
                name: character ?.name,
                height: character ?.height,
                gender: character ?.gender,
                homeworld,
            };
            favorites.push(newFavorite);
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
        setIsFavorite(!isFavorite);
    };


    useEffect(() => {
        const favorites: Favorite[] = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.some((fav) => fav.id === id));
    }, [id]);

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
                Back to Character List
            </button>
            <h1 className={styles.heading}>Character Details</h1>
            {character ? (
                <div>
                    <p className={styles.details}>
                        <strong>Name:</strong> {character.name}
                    </p>
                    <p className={styles.details}>
                        <strong>Hair Color:</strong> {character.hair_color}
                    </p>
                    <p className={styles.details}>
                        <strong>Eye Color:</strong> {character.eye_color}
                    </p>
                    <p className={styles.details}>
                        <strong>Gender:</strong> {character.gender}
                    </p>
                    <p className={styles.details}>
                        <strong>Home Planet:</strong> {homeworld}
                    </p>

                    <div className={styles.listSection}>
                        <h2>Films</h2>
                        {films.length > 0 ? (
                            <ul>
                                {films.map((film, index) => (
                                    <li key={index}>{film}</li>
                                ))}
                            </ul>
                        ) : (
                                <p>No films available</p>
                            )}
                    </div>

                    <div className={styles.listSection}>
                        <h2>Starships</h2>
                        {starships.length > 0 ? (
                            <ul>
                                {starships.map((starship, index) => (
                                    <li key={index}>{starship}</li>
                                ))}
                            </ul>
                        ) : (
                                <p>No starships available</p>
                            )}
                    </div>

                    <button
                        onClick={toggleFavorite}
                        className={`${styles.favoriteButton} ${
                            isFavorite ? styles.red : styles.green
                            }`}
                    >
                        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                </div>
            ) : (
                    <p>Loading character details...</p>
                )}
        </div>
    );
};

export default CharacterDetails;
