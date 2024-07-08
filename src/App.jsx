import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const OMDB_URL = `https://www.omdbapi.com/?&apikey=${API_KEY}`;

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    Runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onFocus={(e) => {
        setQuery("");
      }}
    />
  );
}

function NumResult({ watched }) {
  return (
    <p className="num-results">
      Found <strong>{watched?.length || 0}</strong> results
    </p>
  );
}

export default function App() {
  const [query, setQuery] = useState("kill bill");
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleUpdateWatched = (movie) => {
    setWatched((watched) => {
      const index = watched.findIndex((m) => m.imdbID === movie.imdbID);
      watched[index] = movie;
      return watched;
    });
  };

  const handleDeleteWatched = (movie) => {
    setWatched((watched) => {
      return watched.filter((m) => m.imdbID !== movie.imdbID);
    });
  };

  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch(`${OMDB_URL}&s=${query}`);
      const data = await res.json();
      setMovies(data.Search);
    }

    if (query.length < 3) {
      setMovies([]);
      return;
    }
    fetchMovies();
  }, [query]);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult watched={movies} />
      </NavBar>
      <Main>
        <Box>
          <MovieList movies={movies} onSelect={setSelectedId} />
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              onClose={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
              onUpdateWatched={handleUpdateWatched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedList watched={watched} onDelete={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Movie({ movie, onSelect }) {
  return (
    <li
      onClick={() => {
        onSelect(movie.imdbID);
      }}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(
    watched.map((movie) => {
      const runtime = movie.Runtime.split(" ")[0];
      return parseInt(runtime);
    })
  );

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched?.length || 0} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>
            {
              // to fixed to 1 decimal place
              avgUserRating.toFixed(1)
            }
          </span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function MovieList({ movies, onSelect }) {
  return (
    <ul className="list list-movies">
      {!movies
        ? "Movies not found"
        : movies.map((movie) => (
            <Movie movie={movie} key={movie.imdbID} onSelect={onSelect} />
          ))}
    </ul>
  );
}

function WatchedList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDelete }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.Runtime}</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => {
          onDelete(movie);
        }}
      >
        X
      </button>
    </li>
  );
}

function SelectedMovie({
  selectedId,
  onClose,
  onAddWatched,
  watched,
  onUpdateWatched,
}) {
  const [movie, setMovie] = useState({});
  const [rating, setRating] = useState(movie.userRating);
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  useEffect(() => {
    setRating("");
    async function fetchMovie() {
      const res = await fetch(`${OMDB_URL}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
    }

    fetchMovie();

    // set user rating if movie is already watched
    if (isWatched) {
      setRating(watchedUserRating);
    }
  }, [selectedId]);

  return (
    <div className="details">
      {movie === null ? (
        "Loading..."
      ) : (
        <>
          <header>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Year} · {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} IMDb rating
              </p>
            </div>
            <button className="btn-back" onClick={onClose}>
              X
            </button>
          </header>
          <section>
            <div className="rating">
              {isWatched && <p>You watched this movie before!</p>}
              <StarRating
                size={24}
                maxRating={10}
                onSetRating={setRating}
                defaultRating={rating}
              />
              {rating != watchedUserRating && rating && (
                <button
                  className="btn-add"
                  onClick={() => {
                    if (isWatched) {
                      onUpdateWatched({
                        ...movie,
                        userRating: rating,
                      });
                      onClose();
                      return;
                    }
                    onAddWatched({
                      ...movie,
                      userRating: rating,
                    });
                    onClose();
                  }}
                >
                  {isWatched ? "Update rating" : "+ Add to watched list"}
                </button>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
