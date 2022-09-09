<script lang="ts">
    import { onMount } from "svelte";   
    import { navigate } from "svelte-navigator";
    import { scale, slide } from "svelte/transition";
    import { Input } from 'sveltestrap';
    import moment from "../services/utils/momentCustom";

    import Spinner from "../components/Spinner.svelte";
    import FavoriteButton from "../components/FavoriteButton.svelte";

    import { authStore } from "../hooks/auth.hook";

    import {
        getMediaDetails,
        getWatchProviders,
        getSeasonDetails,
        getMediaActors,
        getMediaImages,
        getMediaVideos,
        getMediaRecommendations
    } from "../services/movieDb";

    import {
        getTvById,
        addTv,
        deleteTv
    } from "../services/tvRepo";

    import { handleErrorActorImg } from "../services/utils/handleError"

    import type TvModel from "../models/tv.model";

    export let params;
    let { id } = params;

    let datas;
    let timeSeason: boolean = false,
        timeActors: boolean = false, 
        timeVideos: boolean = false,
        timeImages: boolean = false, 
        timeRecommendations: boolean = false;

    let providerLink: string;

    let isGetDocumentId: boolean = true;
    let isFavoris: boolean = false;

    let documentId: string; // document ID of tv added on firebase

    let seasonSelected: string = "0";

    let displayEpisodes: boolean = false;
    let loadingEpisodes: boolean = true;
    let indexEpisodesSelected: number;
    let episodesSeason: {seasonNumber: number, episodes: any[]}[] = [];
    let episodesSelectedToFilter: any[] = [];
    let episodesFilteredToWatch: any[] = [];
    let uid: string; // uid of authenticate user

    onMount(async() => {
        uid = $authStore.uid;

        if(Number(id)) await fetchTvDetails(id);
        else navigate("/home", { replace: true });
        
        initTvDetails();
        await getFavorisId();
        
        datas = datas;
	});

    const initTvDetails = () => {
        setTimeout(() => timeSeason = true, 1000);
        setTimeout(() => timeActors = true, 3000);
        setTimeout(() => timeVideos = true, 3000);
        setTimeout(() => timeImages = true, 5000);
        setTimeout(() => timeRecommendations = true, 9000);
    }

    const getFavorisId = async() => {
        if(datas.details) {
            documentId = await getTvById(datas.details.id, uid); // check if tv added in firebase and get docId
            if(documentId) {
                isFavoris = true;
            }
            isGetDocumentId = true;
        }
    }

    const fetchTvDetails = async(idTv) => {
        datas = {
            details: await getMediaDetails(idTv, "tv"),
            actors: await getMediaActors(idTv, "tv"),
            videos: await getMediaVideos(idTv, "tv"),
            images: await getMediaImages(idTv, "tv"),
            recommendations: await getMediaRecommendations(idTv, "tv")
        };
        
        datas.recommendations.sort((a,b) => b.vote_count - a.vote_count);

        providerLink = await getWatchProviders(datas.details.id, "tv");
    }

    const fetchTvFromRecommendations = async(idTv: number) => {
        navigate(`/tv-details/${idTv}`, { replace: true });
        document.body.scrollIntoView();

        setTimeout(async() => {
            id = params.id;

            datas = null;
            timeActors = false;
            timeVideos = false;
            timeImages = false;
            timeRecommendations = false;
            isFavoris = false;
            isGetDocumentId = false;

            seasonSelected = "0";

            displayEpisodes = false;
            loadingEpisodes = true;
            indexEpisodesSelected = null;
            episodesSeason = [];
    
            await fetchTvDetails(idTv);
    
            initTvDetails();
            await getFavorisId();

            datas = datas;
        }, 1000);
        
    }

    const fetchAllEpisodesSeason = async(numSeason: number) => {
        if(!displayEpisodes) {
            loadingEpisodes = true; displayEpisodes = true;
    
            const seasonNumber = Number(seasonSelected);
            if(typeof seasonNumber == "number") {
                let indexCurrentSeason = episodesSeason.findIndex(element => element.seasonNumber === seasonNumber);
                if(indexCurrentSeason >= 0) {
                    indexEpisodesSelected = indexCurrentSeason;
                } else {
                    const newSeason = await getSeasonDetails(id, numSeason);
                    episodesSeason.push({
                        seasonNumber: newSeason.season_number,
                        episodes: newSeason.episodes
                    });
                    indexEpisodesSelected = episodesSeason.length - 1;
                }
                episodesSelectedToFilter = Array.from(episodesSeason[indexEpisodesSelected].episodes);
                episodesFilteredToWatch = [];
                selectEpisodesToDisplay();
                loadingEpisodes = false;
            } else {
                loadingEpisodes = false; displayEpisodes = false; 
            }
        } else {
            displayEpisodes = false;
        }
    }

    const addTvToFavorite = async() => {
        const { 
            id, name, original_name, original_language, first_air_date, overview, tagline, poster_path, backdrop_path, number_of_seasons, number_of_episodes, popularity, vote_average, vote_count, in_production
        } = datas.details;

        const tv: TvModel = { id, name, original_name, original_language, first_air_date, overview, tagline, poster_path, backdrop_path, number_of_seasons, number_of_episodes, popularity, vote_average, vote_count, in_production };
        
        try {
           documentId = await addTv(tv, uid);
           isFavoris = true;
        } catch (error) {
            console.error(error);
        }
    }

    const deleteTvToFavorite = async(doc_id: string) => {
        try {
            await deleteTv(doc_id, uid);
            isFavoris = false;
        } catch (error) {
            console.error(error);
        }
    }

    const selectEpisodesToDisplay = () => {
        if(episodesSelectedToFilter.length >= 10) {
            for(let i = 0; i < 10; i++) {
                episodesFilteredToWatch.push(episodesSelectedToFilter[i]);
            }
            episodesSelectedToFilter.splice(0, 10);
            episodesFilteredToWatch = episodesFilteredToWatch;
        } else if(episodesSelectedToFilter.length > 0){
            episodesFilteredToWatch = [...episodesFilteredToWatch, ...episodesSelectedToFilter];
            episodesSelectedToFilter.splice(0, episodesSelectedToFilter.length);
        }
    }

    const resetEpisodesSelected = () => {
        episodesFilteredToWatch = [];
        displayEpisodes = false;
    }

    const navigateToActorDetails = (id) => {
        localStorage.setItem("previous_page", "tv-details");
        localStorage.setItem("media_id", datas.details.id);
        navigate(`/actor-details/${id}`, { replace: true });
    }
</script>

{#if datas}
    {#if datas.details}
        <div 
            id="block-tv-details"
            style="
                background: linear-gradient(rgba(27.45%, 22.75%, 19.22%, 0.88), rgba(27.45%, 22.75%, 19.22%, 0.88), rgba(27.45%, 22.75%, 19.22%, 0.88)), url(https://image.tmdb.org/t/p/original{datas.details.backdrop_path}) no-repeat;
                background-size: cover;
                background-position: 100% 20%;"
                in:slide
                out:scale={{delay: 200}}  
        >
            <div style="display: flex;justify-content: center;width: 70%;color: white;margin:2%;">
                <div id="block-image">
                    <a id="image_{datas.details.id}" href="https://image.tmdb.org/t/p/original{datas.details.poster_path}" target="_blank">
                        <img src="https://image.tmdb.org/t/p/w500{datas.details.poster_path}" alt="Poster tv">
                    </a>
                </div>
                <div id="block-details">
                    <h2 id="title-details">
                        {datas.details.name}
                    </h2>

                    {#if providerLink}
                        <a href={providerLink["FR"].link} id="watch-providers"  target="_blank">
                            <img src="/images/justwatch.svg" alt="Just Watch">
                            <p>Disponible en Streaming</p>
                        </a>
                    {/if}
                    <hr>
                    <div id="content-details">
                        <p>{datas.details.vote_average.toFixed(1)}/10</p>
                        <p>{new Date(datas.details.first_air_date).getFullYear()}</p>
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
                                deleteMediaToFavorite={deleteTvToFavorite}
                                addMediaToFavorite={addTvToFavorite}
                            />
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

    {#if datas.details && datas.details.seasons && timeSeason}    
        <div id="season-select" style="width: 200px;" out:scale={{delay: 200}}>
            <Input type="select" name="select" bind:value={seasonSelected} on:change={() => resetEpisodesSelected()}>
                {#each datas.details.seasons as season, index}    
                    <option value="{index.toString()}"> {season.name} </option>
                {/each}
            </Input>
        </div>
        <div id="block-seasons" out:scale={{delay: 200}}>
            <div id="block-season-description">
                <img id="block-image-season" src="https://image.tmdb.org/t/p/w500{datas.details.seasons[seasonSelected].poster_path}" alt="poster season">
                <div id="description-season">
                    <div id="block-details-season">
                        <div id="title-season"> {datas.details.seasons[seasonSelected].name} </div>
                        <p id="content-details-season">
                            {(episodesFilteredToWatch.length ? new Date(episodesFilteredToWatch[0].air_date).getFullYear() : (datas.details.seasons[seasonSelected].air_date ? new Date(datas.details.seasons[seasonSelected].air_date).getFullYear() : "____"))}
                             | 
                            {datas.details.seasons[seasonSelected].episode_count} épisodes
                        </p>
                    </div>
                    <p>La {(datas.details.seasons[seasonSelected].season_number) ? datas.details.seasons[seasonSelected].name : "Saison 0"} de {datas.details.name} a été diffusée à partir du {(episodesFilteredToWatch.length ? moment(episodesFilteredToWatch[0].air_date).format("LL") : (datas.details.seasons[seasonSelected].air_date ? moment(datas.details.seasons[seasonSelected].air_date).format("LL") : "(aucune date)"))}.</p>
                    <p id="overview-season">{datas.details.seasons[seasonSelected].overview}</p>
                    {#if datas.details.seasons[seasonSelected].season_number > 0}
                        <p id="display-episodes" on:click={() => fetchAllEpisodesSeason(datas.details.seasons[seasonSelected].season_number)}>Episodes <img src="/images/icon-arrow-bottom.png" alt="icon arrow bottom"></p>
                    {/if}  
                </div>
            </div>
            {#if displayEpisodes}                   
                <div id="block-episodes">
                    {#if !loadingEpisodes}
                        {#each episodesFilteredToWatch as episode}
                            <div class="card_episode">
                                <div class="title_image_episode">
                                    <p>{episode.episode_number} - {episode.name}</p>
                                    <img src="https://image.tmdb.org/t/p/original{episode.still_path}" alt="poster episode">
                                </div>
                                <div>
                                    <i style="margin-left: 10px; font-family: 'Rye';">{episode.vote_average.toFixed(1)}/10 | {episode.runtime} min | diffusé le {(episode.air_date) ? moment(episode.air_date).format("LL") : "(aucune date)"}</i>
                                    <p>{episode.overview}</p>
                                </div>
                            </div>
                        {/each}
                        {#if episodesSelectedToFilter.length > 0}
                            <div id="display-next-episodes" on:click={selectEpisodesToDisplay}>
                                <p>Afficher les épisodes suivants</p>
                                <img src="/images/icon-arrow-bottom.png" alt="icon arrow bottom">
                            </div>
                        {/if}
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
            {/if}
        </div>
    {/if}

    <div class="tv_details" out:scale={{delay: 200}}>
        <h2 class="title_block">Casting</h2>
        <div id="actors" class={(!timeActors) ? "loading_datas" : ""}>
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
                        on:click={() => fetchTvFromRecommendations(recommendation.id)}
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
    #block-episodes {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border: 1px solid rgba(0,0,0,.125);
        border-radius: 20px;
        box-shadow: 2px 5px 5px grey;
        padding: 20px;
        margin: 10px 10px 10px 10px;
        height: 400px;
    }
    #display-episodes {
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        width: max-content;
        padding: 5px;
        border: 1px solid #e0f2f185;
        border-radius: 15px;
        cursor: pointer;
    }
    #display-episodes:hover {
        background-color: white;
        color: rgba(27.45%, 22.75%, 19.22%, 0.88);
    }
    #display-next-episodes {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    #display-next-episodes p {
        margin-bottom: unset;
        color: white;
        background-color: black;
        padding: 5px;
        border-radius: 15px;
    }
    #display-next-episodes img {
        width: 40px;
    }
    #display-next-episodes:hover {
        background: radial-gradient(#f9f9f980, transparent 70%);
        cursor: pointer;
    }
    .card_episode {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: white;
        border: 1px solid #e0f2f185;
        border-radius: 20px;
        box-shadow: 10px 5px 5px grey;
        padding: 10px;
        margin-bottom: 20px;
    }
    .title_image_episode {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-right: 20px;

        font-weight: 900;
        font-size: 18px;
        width: 20%;

    }
    .card_episode img {
        width: 227px;
        height: 127px;
        margin-bottom: 20px;
        border-radius: 15px;
    }
    .card_episode p {
        padding: 5px;
    }

    .loading_datas {
        height: 411px;
    }
    #season-select {
        margin-top: 20px;
        margin-left: 20px;
    }
    #season-select > :global(select) {
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        color: white;
        cursor: pointer;
    }
    #block-season-description {
        display: flex;
    }
    #block-title {
        font-weight: 900;
        font-size: 18px;
    }
    #block-image-season {
        border-radius: 20px;
        width: 130px;
        height: 200px;
    }
    #description-season {
        margin-left: 30px;
        width: 70%;
        color: white;
    }
    #block-details-season {
        display: flex;
    }
    #content-details-season {
        margin-left: 10px;
        font-style: italic;
    }
    #overview-season {
        padding: 10px;
    }
    .tv_details h2{
        padding-left: 20px;
    }
    
    #block-image {
        cursor: pointer;     
        transition: all 0.5s ease;
    }
    #block-image:hover {
        transform: scale(1.04);
        transform-origin: bottom right 40px;
    }
    #block-tv-details {
        display: flex;
        justify-content: center;
        height: auto;
        box-shadow: -3px 3px 2px 1px rgb(0 0 0 / 20%);
    }
    #block-tv-details img {
        width: 300px;
        height: 450px;
        box-shadow: -12px -12px 2px 1px rgba(0, 0, 0, 0.2);
        /* box-shadow: 12px 12px 2px 1px rgba(0, 0, 0, 0.2); */
    }
    #title-details {
        text-shadow: 0 0 4px white, 0 -5px 4px #ffff33, 2px -10px 6px #ffdd33, -2px -15px 11px #ff8800, 2px -25px 18px #ff2200;
        color: #000;
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
        transform: scale(1.04);
        transform-origin: bottom right 40px;
    }
    #watch-providers img {
        width: unset;
        height: 18px;
        box-shadow: none;
    }
    #block-seasons {
        display: flex;
        flex-direction: column;
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border: 1px solid rgba(0,0,0,.125);
        border-radius: 20px;
        box-shadow: 10px 5px 5px grey;
        padding: 10px;
        margin: 0px 10px 10px 10px;
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
    #actors::-webkit-scrollbar, #trailers::-webkit-scrollbar, #images::-webkit-scrollbar, #recommendations::-webkit-scrollbar, #block-episodes::-webkit-scrollbar {
        width: 15px;
        background-color: #F5F5F5;
    } 
    #actors::-webkit-scrollbar-thumb, #trailers::-webkit-scrollbar-thumb, #images::-webkit-scrollbar-thumb, #recommendations::-webkit-scrollbar-thumb, #block-episodes::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background: radial-gradient(#d4d4d4, rgba(27.45%, 22.75%, 19.22%, 0.88));
        box-shadow: 1px 1px 12px #555;
    } 
    #actors::-webkit-scrollbar-track, #trailers::-webkit-scrollbar-track, #images::-webkit-scrollbar-track, #recommendations::-webkit-scrollbar-track, #block-episodes::-webkit-scrollbar-track {
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