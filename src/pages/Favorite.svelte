<script lang="ts">  
    import { onMount } from "svelte";
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

    import FavoriteMovie from "../components/FavoriteMovie.svelte";
    import MovieDescription from "../components/MovieDescription.svelte";
    import Spinner from "../components/Spinner.svelte";

    import { getMovies, deleteMovie } from "../services/movieRepo";
    
    import type FavoriteMovieModel from '../models/FavoriteMovie.model';
    import type FavoriteActorModel from '../models/favoriteActor.model';
    import type MovieModel from "../models/movie.model";

    let favoritesMovies: FavoriteMovieModel[] = [];
    let favoritesActors: FavoriteActorModel[] = [];

    let movieDisplayed: MovieModel;

    let timeMovies: boolean = false;
    let timeActors: boolean = false;

    let noFavoritesMovies: boolean = false;
    let noFavoritesActors: boolean = false;

    onMount(async() => {
        favoritesMovies = await getMovies();
        initFavoriteComponent();
    });

    const initFavoriteComponent = () => {
        if(favoritesMovies) {
            setTimeout(() => {
                timeMovies = true;
            }, 1000);
            setTimeout(() => {
                movieDisplayed = favoritesMovies[0].movie;
            }, 2000);
        }
        else noFavoritesMovies = true;
        
        if(favoritesActors) setTimeout(() => timeActors = true, 3000);
        else noFavoritesActors = true;
    }

    const displayMovie = (documentId: string) => {
        movieDisplayed = favoritesMovies.find(favorite => favorite.documentId == documentId).movie;
        document.body.scrollIntoView();
    }

    const removeMovieToFavoris = async(index: number) => {
        const documentId = favoritesMovies[index].documentId;
        const movie_id = favoritesMovies[index].movie.id;

        await deleteMovie(documentId);

        favoritesMovies.splice(index, 1);

        if(favoritesMovies.length == 0) {
            noFavoritesMovies = true;
            movieDisplayed = null;
        } else {
            if(movieDisplayed.id == movie_id) {
                movieDisplayed = favoritesMovies[0].movie;
            }
        }

        favoritesMovies = favoritesMovies;
    }

</script>

{#if favoritesMovies}
    {#if movieDisplayed}
        <MovieDescription movie={movieDisplayed} />
    {/if}

    <h1 class="title_block" style="margin-top: 20px;"> Films </h1>
    <div class="block_media">
        {#if timeMovies}
            {#if noFavoritesMovies}
                <p class="no_media_text">Aucun film pour le moment</p>
            {:else}
                {#each favoritesMovies as favorite , i (favorite)}
                <div class="child_component_block" transition:fly={{ y: -60 }} animate:flip={{ delay:150, duration:500 }}>
                    <FavoriteMovie 
                        documentId={favorite.documentId} 
                        poster_path={favorite.movie.poster_path}
                        index={i}
                        displayMovie={displayMovie}
                        removeMovie={removeMovieToFavoris}
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
    .no_media_text {
        color: white;
        font-size: 20px;
        margin: auto;
    }
</style>