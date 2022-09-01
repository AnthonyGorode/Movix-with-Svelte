import axios from "axios";

// Create a instance of axios to use the same base url.
const axiosAPI = axios.create({
  baseURL : "https://api.themoviedb.org/3/" // it's not recommended to have this info here.
});

const apiKey = "2fae416c150ee4b2e2c62a138bf9b3ea";

async function fetchMedia(url: string, type: "data" | "results") {
    const pending = await axiosAPI.get(url);
    
    if(type === "results") {
        return pending.data.results;
    }

    return pending.data
}

const getMoviesDiscover = async() => {
    return fetchMedia(`/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&language=fr-FR`,"results");
}

const getMoviesMarvel = async() => {
    return fetchMedia(`/movie/popular?api_key=${apiKey}&language=fr&with_companies=420`, "results");
}

const getMoviesDC = async() => {
    return fetchMedia(`/movie/popular?api_key=${apiKey}&language=fr&with_companies=9993`, "results");
}

const getMovieTrending = async() => {
    return fetchMedia(`/trending/movie/week?api_key=${apiKey}&language=fr-FR`, "results");
}

const getMovieScifi = async() => {
    return fetchMedia(`/discover/movie?with_genres=878&primary_release_year=2019&api_key=${apiKey}&language=fr-FR`, "results");
}

const getMovieDrama = async() => {
    return fetchMedia(`/discover/movie?with_genres=18&primary_release_year=2020&api_key=${apiKey}&adult=false&language=fr-FR`, "results");
}

const getMovieDetails = async(idFilm: number) => {
    return fetchMedia(`movie/${idFilm}?api_key=${apiKey}&language=fr`, "data");
}

const getMovieActors = async(idFilm: number) => {
    return fetchMedia(`/movie/${idFilm}/credits?api_key=${apiKey}&language=fr-FR`, "data");
}

// https://api.themoviedb.org/3/movie/522938/images?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr
const getMovieImages = async(idFilm: number) => {
    return fetchMedia(`/movie/${idFilm}/images?api_key=${apiKey}&language=fr`, "data");
}

const getMovieVideos = async(idFilm: number) => {
    return fetchMedia(`/movie/${idFilm}/videos?api_key=${apiKey}&language=fr`, "results");
}
// https://api.themoviedb.org/3/movie/610150/recommendations?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr
const getMovieRecommendations = async(idFilm: number) => {
    return fetchMedia(`/movie/${idFilm}/recommendations?api_key=${apiKey}&language=fr`, "results");
}

// https://api.themoviedb.org/3/person/1654001?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr
const getActorDetails = async(idActor: number) => {
    return fetchMedia(`/person/${idActor}?api_key=${apiKey}&language=fr`, "data");
}
// https://api.themoviedb.org/3/person/1654001/movie_credits?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr
// https://api.themoviedb.org/3/discover/movie?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=3896
const getMoviesActor = async(idActor: number) => {
    return fetchMedia(`/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=${idActor}&language=fr-FR`, "results");
}

export {
    getMoviesDiscover,
    getMoviesMarvel,
    getMoviesDC,
    getMovieTrending,
    getMovieScifi,
    getMovieDrama,
    getMovieDetails,
    getMovieActors,
    getMovieImages,
    getMovieVideos,
    getMovieRecommendations,
    getActorDetails,
    getMoviesActor
};