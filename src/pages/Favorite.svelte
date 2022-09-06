<script lang="ts">  
    import { onMount } from "svelte";
	import { fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
    import { navigate } from "svelte-navigator";

    import FavoriteMedia from "../components/FavoriteMedia.svelte";
    import MediaDescription from "../components/MediaDescription.svelte";
    import Spinner from "../components/Spinner.svelte";
    import SelectorMedia from "../components/SelectorMedia.svelte";

    import { getMovies, deleteMovie } from "../services/movieRepo";
    import { getTvs, deleteTv } from "../services/tvRepo";
    import { getActors, deleteActor } from "../services/actorRepo";
    import { handleErrorActorImg } from "../services/utils/handleError";
    
    import type FavoriteMovieModel from '../models/FavoriteMovie.model';
    import type FavoriteTvModel from "../models/favoriteTv.model";
    import type FavoriteActorModel from '../models/favoriteActor.model';
    import type MovieModel from "../models/movie.model";
    import type TvModel from "../models/tv.model";

    let favoritesDatas: {movie: FavoriteMovieModel[], tv: FavoriteTvModel[]} = {movie: [], tv: []};
    let keyMediaFavorite: "movie" | "tv" = "movie"; // movie | tv

    let favoritesActors: FavoriteActorModel[] = [];

    let mediaDisplayed: MovieModel | TvModel;

    let loadingDatas:boolean = false;
    let timeMedia: boolean = false;
    let timeActors: boolean = false;

    let noFavoritesMovies: boolean = false;
    let noFavoritesTvs: boolean = false;
    let noFavoritesActors: boolean = false;

    onMount(async() => {      
        initFavoriteComponent();   
    });

    const initFavoriteComponent = async() => {
        try {
            favoritesDatas.movie = await getMovies();
            favoritesDatas.tv = await getTvs();
            favoritesActors = await getActors();

            if(favoritesDatas.movie.length) {
                setTimeout(() => {
                    timeMedia = true;
                }, 1000);
                setTimeout(() => {
                    mediaDisplayed = favoritesDatas.movie[0].movie;
                }, 2000);
            }
            else noFavoritesMovies = true;

            if(!favoritesDatas.tv.length) noFavoritesTvs = true;
            
            if(favoritesActors) setTimeout(() => timeActors = true, 3000);
            else noFavoritesActors = true;
            
            loadingDatas = true;
        } catch (error) {
            loadingDatas = true;
            console.error(error);
        }    
    }

    const displayMedia = (documentId: string, media: "movie" | "tv") => {
        if(media == "movie") {
            mediaDisplayed = favoritesDatas.movie.find(favorite => favorite.documentId == documentId).movie;
            document.body.scrollIntoView();
        } else {
            mediaDisplayed = favoritesDatas.tv.find(favorite => favorite.documentId == documentId).tv;
            document.body.scrollIntoView();
        }
    }

    const displayActorDetails = (documentId: string) => {
        const actor = favoritesActors.find(favorite => favorite.documentId == documentId).actor;
        localStorage.clear();
        navigate(`/actor-details/${actor.id}`, { replace: true });
    }

    const removeMovieToFavorite = async(index: number) => {
        const documentId = favoritesDatas.movie[index].documentId;
        const movie_id = favoritesDatas.movie[index].movie.id;

        await deleteMovie(documentId);

        favoritesDatas.movie.splice(index, 1);

        if(favoritesDatas.movie.length == 0) {
            noFavoritesMovies = true;
            mediaDisplayed = null;
        } else {
            if(mediaDisplayed.id == movie_id) {
                mediaDisplayed = favoritesDatas.movie[0].movie;
            }
        }

        favoritesDatas.movie = favoritesDatas.movie;
    }

    const removeTvToFavorite = async(index: number) => {
        const documentId = favoritesDatas.tv[index].documentId;
        const tv_id = favoritesDatas.tv[index].tv.id;

        await deleteTv(documentId);

        favoritesDatas.tv.splice(index, 1);

        if(favoritesDatas.tv.length == 0) {
            noFavoritesTvs = true;
            mediaDisplayed = null;
        } else {
            if(mediaDisplayed.id == tv_id) {
                mediaDisplayed = favoritesDatas.tv[0].tv;
            }
        }

        favoritesDatas.tv = favoritesDatas.tv;
    }

    const removeActorToFavorite = async(index: number) => {
        const documentId = favoritesActors[index].documentId;

        await deleteActor(documentId);

        favoritesActors.splice(index, 1);

        if(favoritesActors.length == 0) {
            noFavoritesActors = true;
        }

        favoritesActors = favoritesActors;
    }

    const switchMedia = async(media: "movie" | "tv", type: string = "") => {
        timeMedia = false;
        keyMediaFavorite = media;
        setTimeout(() => {
            if(favoritesDatas[media].length) {
                mediaDisplayed = favoritesDatas[media][0][media];
            } else {
                mediaDisplayed = null;
            }
            timeMedia = true;
        },1800);
    }

</script>

{#if loadingDatas}
    {#if mediaDisplayed}
        <MediaDescription media={mediaDisplayed} typeMedia={keyMediaFavorite} />
    {/if}
    <div class="title_container" out:scale={{delay: 200}}>
        <h2 class="title_block" style="margin-top: 20px;"> {keyMediaFavorite == "movie" ? "Films" : "Séries TV"} </h2>
        <SelectorMedia keyMedia={keyMediaFavorite} typeMedia="discover" switchMedia={switchMedia} />
    </div>
    <div class="block_media" out:scale={{delay: 200}}>
        {#if timeMedia}
            {#if keyMediaFavorite == "movie" && noFavoritesMovies}
                <p class="no_media_text">Aucun film pour le moment</p>
            {:else if keyMediaFavorite == "tv" && noFavoritesTvs}           
                <p class="no_media_text">Aucune Série TV pour le moment</p>
            {:else}
                {#each favoritesDatas[keyMediaFavorite] as favorite , i (favorite)}
                <div class="child_component_block" transition:fly={{ y: -60 }} animate:flip={{ delay:150, duration:500 }}>
                    <FavoriteMedia 
                        documentId={favorite.documentId} 
                        poster_path={favorite[keyMediaFavorite].poster_path}
                        index={i}
                        title={favorite[keyMediaFavorite].title}
                        typeMedia={keyMediaFavorite}
                        displayMedia={displayMedia}
                        removeMovie={removeMovieToFavorite}
                        removeTv={removeTvToFavorite}
                    />
                </div>            
                {/each}
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

    <h2 class="title_block" style="margin-top: 20px;" out:scale={{delay: 200}}> Acteurs / Actrices </h2>
    <div class="block_media" out:scale={{delay: 200}}>
        {#if timeActors}
            {#if noFavoritesActors}
                <p class="no_media_text">Aucun Acteur ou Actrice pour le moment</p>
            {:else}
                {#each favoritesActors as favorite , i (favorite)}
                <div class="child_component_block" transition:fly={{ y: -60 }} animate:flip={{ delay:150, duration:500 }}>
                    <FavoriteMedia 
                        documentId={favorite.documentId} 
                        poster_path={favorite.actor.profile_path}
                        fullName={favorite.actor.name}
                        index={i}
                        typeMedia={keyMediaFavorite}
                        displayMedia={displayActorDetails}
                        removeMedia={removeActorToFavorite}
                        handleErrorImg={handleErrorActorImg}
                    />
                </div>            
                {/each}
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
{:else}
    <div class="main_spinner">
        <img src="/images/loading_new.gif" alt="loading gif" >
    </div>
{/if}

<style>
    .no_media_text {
        color: white;
        font-size: 20px;
        margin: auto;
    }
</style>