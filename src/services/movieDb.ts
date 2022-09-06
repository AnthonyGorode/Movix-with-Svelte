import axios from "axios";

// Create a instance of axios to use the same base url.
const axiosAPI = axios.create({
  baseURL : "https://api.themoviedb.org/3/" // it's not recommended to have this info here.
});

const apiKey = "2fae416c150ee4b2e2c62a138bf9b3ea";
type media = "movie" | "tv";

async function fetchMedia(url: string, type: "data" | "results" | "") {
    const pending = await axiosAPI.get(url);
    if(type === "results") {
        return pending.data.results;
    }
    if(type === "data") {
        return pending.data
    }

    return pending;
}

const getMediaDiscover = async(media: media) => {
    return fetchMedia(`/discover/${media}?api_key=${apiKey}&with_original_language=en&sort_by=popularity.desc&page=1&language=fr-FR`,"results");
}

const getMediaMarvel = async(media: media) => {
    return fetchMedia(`/${media}/popular?api_key=${apiKey}&language=fr-FR&with_companies=420`, "results");
}

const getMediaTrending = async(media: media) => {
    return fetchMedia(`/trending/${media}/week?api_key=${apiKey}&language=fr-FR`, "results");
}

// https://api.themoviedb.org/3/tv/popular?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr-FR&page=1&with_genres=16&with_original_language=ja
const getMediaAnimes = async(media: media) => {
    return fetchMedia(`/${media}/popular?api_key=${apiKey}&page=1&with_genres=16&with_original_language=ja&sort_by=vote_average.desc&language=fr-FR`, "results");
}

const getMoviesDC = async() => {
    return fetchMedia(`/movie/popular?api_key=${apiKey}&language=fr&with_companies=9993`, "results");
}

const getMovieScifi = async() => {
    return fetchMedia(`/discover/movie?with_genres=878&primary_release_year=2019&api_key=${apiKey}&language=fr-FR`, "results");
}

const getMovieDrama = async() => {
    return fetchMedia(`/discover/movie?with_genres=18&primary_release_year=2020&api_key=${apiKey}&adult=false&language=fr-FR`, "results");
}
// https://api.themoviedb.org/3/tv/37854?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr-FR
const getMediaDetails = async(idMedia: number, media: media) => {
    return fetchMedia(`${media}/${idMedia}?api_key=${apiKey}&language=fr`, "data");
}

// https://api.themoviedb.org/3/tv/92783/season/1?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr-FR
const getSeasonDetails = async(idTv: number, numSeason: number) => {
    return fetchMedia(`tv/${idTv}/season/${numSeason}?api_key=${apiKey}&language=fr`, "data");
}

// https://api.themoviedb.org/3/tv/92783/credits?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr-FR
const getMediaActors = async(idFilm: number, media: media) => {
    return fetchMedia(`/${media}/${idFilm}/credits?api_key=${apiKey}&language=fr-FR`, "data");
}

// https://api.themoviedb.org/3/movie/94997/images?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr
const getMediaImages = async(idFilm: number, media: media) => {
    return fetchMedia(`/${media}/${idFilm}/images?api_key=${apiKey}&language=fr`, "data");
}

const getMediaVideos = async(idFilm: number, media: media) => {
    return fetchMedia(`/${media}/${idFilm}/videos?api_key=${apiKey}&language=fr`, "results");
}

// https://api.themoviedb.org/3/movie/610150/recommendations?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr
const getMediaRecommendations = async(idMedia: number, media: media) => {
    return fetchMedia(`/${media}/${idMedia}/recommendations?api_key=${apiKey}&language=fr`, "results");
}

// https://api.themoviedb.org/3/person/1654001?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr
const getActorDetails = async(idActor: number) => {
    return fetchMedia(`/person/${idActor}?api_key=${apiKey}&language=fr`, "data");
}
// https://api.themoviedb.org/3/person/1654001/movie_credits?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr
// https://api.themoviedb.org/3/discover/movie?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=3896
const getAllMediaActor = async(idActor: number, media: media) => {
    if(media == "movie") {
        return fetchMedia(`/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=${idActor}&language=fr-FR`, "results");
    }
    return fetchMedia(`https://api.themoviedb.org/3/person/${idActor}/tv_credits?api_key=${apiKey}&language=fr`, "data");
}

// https://api.themoviedb.org/3/search/tv?api_key=2fae416c150ee4b2e2c62a138bf9b3ea&language=fr-FR&query=one%20piece&page=1&include_adult=false
const getMediaByQuery = async(query: string, media: media) => {
    return fetchMedia(`/search/${media}?api_key=${apiKey}&query=${query}&page=1&include_adult=false&language=fr-FR`, "results");
}

export {
    getMediaDiscover,
    getMediaMarvel,
    getMediaTrending,
    getMediaAnimes,
    getMoviesDC,
    getMovieScifi,
    getMovieDrama,
    getMediaDetails,
    getSeasonDetails,
    getMediaActors,
    getMediaImages,
    getMediaVideos,
    getMediaRecommendations,
    getActorDetails,
    getAllMediaActor,
    getMediaByQuery
};