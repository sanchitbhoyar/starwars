import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './css/FavouritesView.module.css'
interface FavouriteCharacter {
    id: string;
    name: string;
    height?: string;
    gender?: string;
    homeworld?: string;
}

const FavouritesView: React.FC = () => {
    const [favourites, setFavourites] = useState<FavouriteCharacter[]>([]);
    const navigate = useNavigate();

    // Fetch favourites from localStorage
    useEffect(() => {
        const storedFavourites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavourites(storedFavourites);
    }, []);

    // Remove character from favourites
    const removeFromFavourites = (id: string) => {
        const updatedFavourites = favourites.filter((fav) => fav.id !== id);
        setFavourites(updatedFavourites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavourites));
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Favourites</h1>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
                Back
            </button>

            {favourites.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Name</th>
                            <th className={styles.th}>Height</th>
                            <th className={styles.th}>Gender</th>
                            <th className={styles.th}>Home Planet</th>
                            <th className={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favourites.map((character) => (
                            <tr key={character.id}>
                                <td className={styles.td}>{character.name}</td>
                                <td className={styles.td}>{character.height || "N/A"}</td>
                                <td className={styles.td}>{character.gender || "N/A"}</td>
                                <td className={styles.td}>{character.homeworld || "N/A"}</td>
                                <td className={styles.td}>
                                    <button
                                        onClick={() => removeFromFavourites(character.id)}
                                        className={styles.removeButton}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                    <p className={styles.noFavourites}>No favourites added yet!</p>
                )}
        </div>
    );
};

export default FavouritesView;
