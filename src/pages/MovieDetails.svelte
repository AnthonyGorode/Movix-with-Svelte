<script lang="ts">
    import { onMount } from "svelte";   
    import { navigate } from "svelte-navigator";
    import { scale, slide } from "svelte/transition";

    import Spinner from "../components/Spinner.svelte";
    import FavoriteButton from "../components/FavoriteButton.svelte";

    import { authStore } from "../hooks/auth.hook";

    import {
        getMediaDetails,
        getWatchProviders,
        getMediaActors,
        getMediaImages,
        getMediaVideos,
        getMediaRecommendations
    } from "../services/movieDb";

    import { 
        addMovie,
        getMovieById,
        deleteMovie
    } from "../services/movieRepo";

    import { handleErrorActorImg } from "../services/utils/handleError"

    import type MovieModel from "../models/movie.model";

    export let params;
    const { id } = params;

    let datas;
    let timeActors: boolean = false, 
        timeVideos: boolean = false,
        timeImages: boolean = false, 
        timeRecommendations: boolean = false;

    let providerLink = {};

    let isGetDocumentId: boolean = false;
    let isFavoris: boolean = false;

    let documentId: string; // document ID of movie added on firebase

    let uid: string; // uid of authenticate user

    onMount(async() => {
        uid = $authStore.uid;

        if(Number(id)) await fetchMovieDetails(id);
        else navigate("/home", { replace: true });
        
        initMovieDetails();
        await getFavorisId();
        
        datas = datas;
	});

    const initMovieDetails = () => {
        setTimeout(() => timeActors = true, 3000);
        setTimeout(() => timeVideos = true, 3000);
        setTimeout(() => timeImages = true, 5000);
        setTimeout(() => timeRecommendations = true, 9000);
    }

    const getFavorisId = async() => {
        if(datas.details) {
            documentId = await getMovieById(datas.details.id, uid); // check if movie added in firebase and get docId
            if(documentId) {
                isFavoris = true;
            }
            isGetDocumentId = true;
        }
    }

    const fetchMovieDetails = async(idMovie) => {
        datas = {
            details: await getMediaDetails(idMovie, "movie"),
            actors: await getMediaActors(idMovie, "movie"),
            videos: await getMediaVideos(idMovie, "movie"),
            images: await getMediaImages(idMovie, "movie"),
            recommendations: await getMediaRecommendations(idMovie, "movie")
        };
        
        datas.recommendations.sort((a,b) => b.vote_count - a.vote_count);

        providerLink = await getWatchProviders(datas.details.id, "movie");
        console.log(providerLink);
    }

    const fetchMovieFromRecommendations = async(idMovie: number) => {
        navigate(`/movie-details/${idMovie}`, { replace: true });
        document.body.scrollIntoView();

        setTimeout(async() => {
            datas = null;
            timeActors = false;
            timeVideos = false;
            timeImages = false;
            timeRecommendations = false;
            isFavoris = false;
            isGetDocumentId = false;
    
            await fetchMovieDetails(idMovie);
    
            initMovieDetails();
            await getFavorisId();

            datas = datas;
        }, 1000);
        
    }

    const addMovieToFavorite = async() => {
        const { 
            id, title, original_title, overview, tagline, poster_path, backdrop_path, release_date, budget, revenue, popularity, vote_average, vote_count
        } = datas.details;

        const movie: MovieModel = { id, title, original_title, overview, tagline, poster_path, backdrop_path, release_date, budget, revenue, popularity, vote_average, vote_count };
        
        try {
           documentId = await addMovie(movie, uid);
           isFavoris = true;
        } catch (error) {
            console.error(error);
        }
    }

    const deleteMovieToFavorite = async(doc_id: string) => {
        try {
            await deleteMovie(doc_id, uid);
            isFavoris = false;
        } catch (error) {
            console.error(error);
        }
    }

    const navigateToActorDetails = (id) => {
        localStorage.setItem("previous_page", "movie-details");
        localStorage.setItem("movie_id", datas.details.id);
        navigate(`/actor-details/${id}`, { replace: true });
    }
</script>

{#if datas}
    {#if datas.details}
        <div 
            id="block-film-details"
            style="
                background: linear-gradient(rgba(27.45%, 22.75%, 19.22%, 0.88), rgba(27.45%, 22.75%, 19.22%, 0.88), rgba(27.45%, 22.75%, 19.22%, 0.88)), url(https://image.tmdb.org/t/p/original{datas.details.backdrop_path}) no-repeat;
                background-size: cover;
                background-position: 100% 20%;"
                in:slide
                out:scale={{delay: 200}}  
        >
            <div id="container-details">
                <div id="block-image">
                    <a id="image_{datas.details.id}" href="https://image.tmdb.org/t/p/original{datas.details.poster_path}" target="_blank">
                        <img src="https://image.tmdb.org/t/p/w500{datas.details.poster_path}" alt="Poster film">
                    </a>
                </div>
                <div id="block-details">
                    <h2 id="title-details">
                        {datas.details.title}
                    </h2>
                    {#if providerLink && providerLink.hasOwnProperty("FR")}
                        <a href={providerLink["FR"]?.link} id="watch-providers"  target="_blank">
                            <img src="/images/justwatch.svg" alt="Just Watch">
                            <p>Disponible en Streaming</p>
                        </a>
                    {/if}
                    <hr>
                    <div id="content-details">
                        <p>{datas.details.vote_average.toFixed(1)}/10</p>
                        <p>{new Date(datas.details.release_date).getFullYear()}</p>
                        <p id="genres-details">
                            {#if datas.details.genres}    
                                {#each datas.details.genres as genre}
                                    <i>{genre.name}</i>
                                {/each}
                            {/if}
                        </p>
                        {#if isGetDocumentId}
                            <FavoriteButton 
                                documentId={documentId}
                                isFavorite={isFavoris}
                                deleteMediaToFavorite={deleteMovieToFavorite}
                                addMediaToFavorite={addMovieToFavorite}
                            />
                        {:else}
                            <div class="loading">
                                <Spinner 
                                    widthSpin={30} 
                                    heightSpin={30}
                                    borderSpin={8}
                                    borderTopSpin={8}
                                    borderRadiusSpin={50}
                                />
                            </div>
                        {/if}
                    </div>
                    <hr>
                    <p id="tag-details">
                        {#if datas.details.tagline}
                            " {datas.details.tagline} "
                        {/if}
                    </p>
                    <p id="description-details">
                        {datas.details.overview}
                    </p>
                </div>
            </div>
        </div>
    {/if}

    <div class="movie_details" out:scale={{delay: 200}}>
        <h2 class="title_block">Casting</h2>
        <div id="actors">
            {#if datas.actors && timeActors}   
                {#each datas.actors.cast as actor} 
                    <div 
                        id="actor_{actor.cast_id}"
                        class="block_actor"
                        on:click={() => navigateToActorDetails(actor.id)}
                    >
                        <img src="https://image.tmdb.org/t/p/original{actor.profile_path}" on:error={handleErrorActorImg} alt="{actor.name}" width="200px" height="200px" loading="lazy"/>
                        <h3 class="actor_name">{actor.name}</h3>
                        <h4 class="actor_character">{actor.character}</h4>
                    </div>
                {/each}
            {:else}
                <div class="loading">
                    <Spinner 
                        widthSpin={50} 
                        heightSpin={50}
                        borderSpin={10}
                        borderTopSpin={10}
                        borderRadiusSpin={50}
                    />
                </div>
            {/if}
        </div>

        <hr>

        <h2 class="title_block">Bande annonces</h2>
        <div id="trailers" class={(!timeVideos) ? "loading_datas" : ""}>
            {#if datas.videos && timeVideos}
                {#each datas.videos as video}    
                    <div id="video_{video.id}">
                        <iframe allow="fullscreen" class="block_video" title="trailer youtube" width="600" height="400"
                            src="https://www.youtube.com/embed/{video.key}">
                        </iframe>
                    </div>
                {/each}
            {:else}
                <div class="loading">
                    <Spinner 
                        widthSpin={50} 
                        heightSpin={50}
                        borderSpin={10}
                        borderTopSpin={10}
                        borderRadiusSpin={50}
                    />
                </div>
            {/if}
        </div>

        <hr>

        <h2 class="title_block">Images</h2>
        <div id="images" class={(!timeImages) ? "loading_datas" : ""}>
            {#if datas.images && timeImages}
                {#each datas.images.posters as image, i}    
                    <a id="image_{i}" class="block_image" href="https://image.tmdb.org/t/p/original{image.file_path}" target="_blank">
                        <img src="https://image.tmdb.org/t/p/original{image.file_path}" alt="poster film" width="420" height="400" loading="lazy"/>    
                    </a>
                {/each}
            {:else}
                <div class="loading">
                    <Spinner 
                        widthSpin={50} 
                        heightSpin={50}
                        borderSpin={10}
                        borderTopSpin={10}
                        borderRadiusSpin={50}
                    />
                </div>
            {/if}
        </div>

        <hr>

        <h2 class="title_block">Recommandations</h2>
        <div id="recommendations" class={(!timeRecommendations) ? "loading_datas" : ""}>
            {#if datas.recommendations && timeRecommendations} 
                {#each datas.recommendations as recommendation}     
                    <div 
                        id="recommendation_{recommendation.id}" 
                        class="block_recommendation"
                        title="{recommendation.title}"
                        on:click={() => fetchMovieFromRecommendations(recommendation.id)}
                    >
                        <img src="https://image.tmdb.org/t/p/w500{recommendation.poster_path}" alt="{recommendation.title} - Poster" width="420" height="400" loading="lazy" />    
                    </div>
                {/each}   
            {:else}
                <div class="loading">
                    <Spinner 
                        widthSpin={50} 
                        heightSpin={50}
                        borderSpin={10}
                        borderTopSpin={10}
                        borderRadiusSpin={50}
                    />
                </div>
            {/if}
        </div>
    </div>
{:else}
    <div class="main_spinner">
        <img src="/images/loading_new.gif" alt="loading gif" >
    </div>
{/if}
<style>
    .movie_details h2{
        padding-left: 20px;
    }
    .loading_datas {
        height: 411px;
    }
    #block-film-details {
        height: auto;
        box-shadow: -3px 3px 2px 1px rgb(0 0 0 / 20%);
    }
    #block-header-details {
        display: flex;
    }
    #title-details {
        align-content: flex-start;
        text-shadow: 0 0 4px white, 0 -5px 4px #ffff33, 2px -10px 6px #ffdd33, -2px -15px 11px #ff8800, 2px -25px 18px #ff2200;
        color: #000;
        width: 80%;
    }
    #watch-providers {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: auto;
        top: 0;
        right: 0;
        color: #ebc453;
        text-decoration: none;
        transition: all 0.5s ease;
    }
    #watch-providers:hover {
        transform: scale(1.1);
        transform-origin: bottom right 40px;
    }
    #watch-providers img {
        width: unset;
        height: 18px;
        box-shadow: none;
    }
    #actors, #trailers, #images, #recommendations {
        display: flex;

        overflow-x: scroll;
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border: 1px solid rgba(0,0,0,.125);
        border-radius: 20px;
        box-shadow: 10px 5px 5px grey;
        padding: 10px;
        margin: 10px;
    }
    #actors::-webkit-scrollbar, #trailers::-webkit-scrollbar, #images::-webkit-scrollbar, #recommendations::-webkit-scrollbar {
        width: 15px;
        background-color: #F5F5F5;
    } 
    #actors::-webkit-scrollbar-thumb, #trailers::-webkit-scrollbar-thumb, #images::-webkit-scrollbar-thumb, #recommendations::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background: radial-gradient(#d4d4d4, rgba(27.45%, 22.75%, 19.22%, 0.88));
        box-shadow: 1px 1px 12px #555;
    } 
    #actors::-webkit-scrollbar-track, #trailers::-webkit-scrollbar-track, #images::-webkit-scrollbar-track, #recommendations::-webkit-scrollbar-track {
        border-radius: 10px;
        box-shadow: none;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
    } 
    .block_actor {
        border: 1px solid rgba(0,0,0,.125);
        border-radius: 10px;
        box-shadow: 10px 5px 5px #483e3e;
        background-color: rgba(118, 95, 77, 0.88);
        margin: 5px;
    }
    .block_image, .block_video, .block_recommendation {
        border: 1px solid rgba(0,0,0,.125);
        border-radius: 10px;
        box-shadow: 10px 5px 5px #483e3e;
        margin: 5px;
    }
    .block_actor, .block_image, .block_recommendation {
        cursor: pointer;
        transition: all 0.5s ease;
    }
    .block_recommendation {
        background-size: cover;
        background-position: center;
    }
    .block_actor:hover, .block_image:hover, .block_recommendation:hover {   
        transform: scale(1.04);
        transform-origin: bottom right 40px;
    }
    #container-details {
        display: flex;
        justify-content: center;
        width: 70%;
        color: white;
        margin:2%;
    }
    #block-image img {
        width: 300px;
        height: 450px;
        box-shadow: -12px -12px 2px 1px rgba(0, 0, 0, 0.2);
        cursor: pointer;  
        
        transition: all 0.5s ease;
    }
    #block-image img:hover {
        transform: scale(1.04);
        transform-origin: bottom right 40px;
        box-shadow: 12px 12px 2px 1px rgb(0 0 0 / 20%);
    }
    @media (max-width: 990px) {
        #container-details {
            width: unset;
        }
        #title-details {
            width: 190px;
        }
    }
    @media (max-width: 600px) {
        #container-details {
            width: unset;
            flex-direction: column;
        }
        #block-image {
            display: flex;
            justify-content: center;
        }
        #block-details {
            margin-top: 20px;
        }
        #title-details {
            visibility: hidden;
        }
        #watch-providers {
            left: 0;
        }
        #content-details {
            flex-wrap: wrap;
            font-size: unset!important;
        }
        .title_block {
            overflow-wrap: anywhere;
        }
    }

    .block_actor img {
        border-radius: 10px;
    }
    .actor_name, .actor_character {
        overflow-wrap: break-word;
        word-wrap: break-word;
        max-width: 200px;

        color: white;
    }
    .actor_name {
        font-size: 25px;
    }
    .actor_character {
        font-size: 16px;
        font-family: 'Rye';
        font-style: italic;
    }
</style>