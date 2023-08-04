import { useEffect, useState } from "react";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import NavBar from "./NavBar";
import NumResult from "./NumResult";
import Logo from "./Logo";
import Search from "./Search";
import Main from "./Main";
import Box from "./Box";
import MovieList from "./MovieList";
import SelectedMovie from "./SelectedMovie";
import WatchedSummary from "./WatchedSummary";
import WatchedMoviesList from "./WatchedMoviesList";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "4f445407";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id)); //movie ye tekrar tıklandığında kapanması için
    console.log(selectedId);
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      //browser api
      const controller = new AbortController();

      //fetchMovies
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found ");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return; //query state length'i 3 karakterden küçük ise fecthMovies() çalışmayacak yani api'a istek göndermeyeceğiz
      }
      handleCloseMovie();
      fetchMovies();

      return () => controller.abort();
      //her yeni istek geldiğinde o anki isteği iptal etmek için
    },
    [query]
  );
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>

      <Main>
        {/*Movies List Box */}
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        {/* Watched Movies Box */}
        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
