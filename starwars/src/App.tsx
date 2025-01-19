import { Routes, Route, Link } from "react-router-dom";
import './App.css';
import CharacterList from './CharacterList';
import CharacterDetails from './CharacterDetails';
import ErrorBoundaryApp from './ErrorBoundaryApp';
import FavouritesView from "./FavouritesView";

import styles from './css/App.module.css'
const App = () => {
  return (
    <div>
      <nav>
        <Link to="/favourites" className={styles.link}>
          Favourites
        </Link>
      </nav>
      <ErrorBoundaryApp>
        <Routes>
          <Route path="/" element={<CharacterList />} />
          <Route path="/character/:id" element={<CharacterDetails />} />
          <Route path="/favourites" element={<FavouritesView />} />
        </Routes>
      </ErrorBoundaryApp>
    </div>
  );
};

export default App;
