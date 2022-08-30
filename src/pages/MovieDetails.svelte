<script lang="ts">
    import { onMount } from "svelte";   
    import { navigate } from "svelte-routing";
    import { scale, fade } from "svelte/transition";
	import { slide } from 'svelte/transition';

    import Spinner from "../components/Spinner.svelte";


    import {
        getMovieDetails,
        getMovieActors,
        getMovieImages,
        getMovieVideos,
        getMovieRecommendations
    } from "../services/movieDb";

    import { 
        addMovie,
        getMovieById,
        deleteMovie
    } from "../services/movieRepo";

    import type MovieModel from "../models/movie.model";

    export let id;

    let datas;
    let timeActors: boolean = false, 
        timeVideos: boolean = false,
        timeImages: boolean = false, 
        timeRecommendations: boolean = false;

    let isGetDocumentId: boolean = false;
    let isFavoris: boolean = false;
    const animate = (node, args) =>
		args.cond ? scale(node, args) : fade(node, args);

    let documentId: string; // document ID of movie added on firebase

    onMount(async() => {
        if(id) await fetchMovieDetails(id);
        else navigate("/home", { replace: true });
        
        initMovieDetails();
        await getFavorisId();
        
        console.log(datas);
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
            documentId = await getMovieById(datas.details.id); // check if movie added in firebase and get docId
            if(documentId) {
                isFavoris = true;
            }
            isGetDocumentId = true;
        }
    }

    const fetchMovieDetails = async(idMovie) => {
        datas = {
            details: await getMovieDetails(idMovie),
            actors: await getMovieActors(idMovie),
            videos: await getMovieVideos(idMovie),
            images: await getMovieImages(idMovie),
            recommendations: await getMovieRecommendations(idMovie)
        };
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

    const addMovieToFavoris = async() => {
        const { 
            id, title, original_title, overview, tagline, poster_path, backdrop_path, release_date, budget, revenue, popularity, vote_average, vote_count
        } = datas.details;

        const movie: MovieModel = { id, title, original_title, overview, tagline, poster_path, backdrop_path, release_date, budget, revenue, popularity, vote_average, vote_count };
        
        try {
           documentId = await addMovie(movie);
           isFavoris = true;
        } catch (error) {
            console.error(error);
        }
    }

    const deleteMovieToFavoris = async(doc_id: string) => {
        try {
            await deleteMovie(doc_id);
            isFavoris = false;
        } catch (error) {
            console.error(error);
        }
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
            <div style="display: flex;justify-content: center;width: 70%;color: white;margin-top:2%;">
                <div id="block-image">
                    <img src="https://image.tmdb.org/t/p/w500{datas.details.poster_path}" alt="Poster film">
                </div>
                <div id="block-details">
                    <h1 id="title-details">
                        {datas.details.title}
                    </h1>
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
                            {#if isFavoris}
                            <button id="btn-added" on:click={ () => deleteMovieToFavoris(documentId) }>
                                <img class="logo" src="/images/valid-logo.png" alt="logo valid" transition:animate={{ cond: isFavoris }} />
                                <!-- {#key isFavoris}    
                                {/key} -->
                            </button>
                            {:else}
                                <button id="btn-favoris" on:click= {() => addMovieToFavoris() }>
                                    <img class="logo" src="/images/plus-logo.png" alt="logo plus" />
                                </button>
                            {/if}
                        {:else}
                            <div class="loading">
                                <Spinner 
                                    widthSpin={20} 
                                    heightSpin={20}
                                    borderSpin={10}
                                    borderTopSpin={10}
                                    borderRadiusSpin={20}
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
        <h1>Casting</h1>
        <div id="actors">
            {#if datas.actors && timeActors}   
                {#each datas.actors.cast as actor} 
                    <div 
                        id="actor_{actor.cast_id}"
                        class="block_actor"
                        on:click={() => navigate(`/actor-details/${actor.id}`, { replace: true })}
                    >
                        <img src="https://image.tmdb.org/t/p/original{actor.profile_path}" alt="{actor.name}" width="200px" height="200px" loading="lazy"/>
                        <h4 class="actor_content">{actor.name}</h4>
                        <h5 class="actor_content">{actor.character}</h5>
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

        <h1>Bande annonces</h1>
        <div id="trailers">
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

        <h1>Images</h1>
        <div id="images">
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

        <h1>Recommandations</h1>
        <div id="recommendations">
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
        <Spinner 
            widthSpin={100} 
            heightSpin={100}
            borderSpin={16}
            borderTopSpin={16}
            borderRadiusSpin={100}
        />
    </div>
{/if}
<style>
    .movie_details h1{
        padding-left: 20px;
    }
    #block-film-details {
        height: auto;
        box-shadow: -3px 3px 2px 1px rgb(0 0 0 / 20%);
    }
    #title-details {
        text-shadow: 0 0 4px white, 0 -5px 4px #ffff33, 2px -10px 6px #ffdd33, -2px -15px 11px #ff8800, 2px -25px 18px #ff2200;
        color: #000;
    }
    #btn-favoris, #btn-added {    
        border: 1px solid transparent;
        background-color: transparent;
    }
    #btn-added {
        width: 50px;
    }
    #btn-added img, #btn-favoris img {
        width: 50px!important;
        height: 50px!important;
        box-shadow: none!important;
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
    }
    .block_actor img {
        border-radius: 10px;
    }
    .actor_content {
        overflow-wrap: break-word;
        word-wrap: break-word;
        max-width: 200px;
    }
</style>