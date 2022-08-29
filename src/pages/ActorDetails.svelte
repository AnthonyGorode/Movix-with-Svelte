<script lang="ts">
    import { onMount } from "svelte";    
    import { navigate } from "svelte-routing";

    import ActorCard from "../components/ActorCard.svelte";
    import Movie from "../components/Movie.svelte";
    import Spinner from "../components/Spinner.svelte";

    import {
        getActorDetails,
        getMoviesActor
    } from "../services/movieDb";

    export let id;
    let actorDatas;

    onMount(async() => {
        if(id) await fetchActorDetails(id);
        else navigate("/home", { replace: true });

        if(actorDatas) {
            console.log(actorDatas.details);
            console.log(actorDatas.movies.cast);
        }
        actorDatas = actorDatas;
    });

    const fetchActorDetails = async(idActor: number) => {
        actorDatas = {
            details: await getActorDetails(idActor), // {}
            movies: await getMoviesActor(idActor) // []
        }
    }
</script>

{#if actorDatas}
    <div id="actor-details-block">
        <ActorCard actorDetails={actorDatas.details} />
        <div id="movies-block">
            <div id="title">Filmographie</div>
            <div id="movies">
                {#each actorDatas.movies.cast as {poster_path, id}} 
                    <Movie poster_path={poster_path} id={id} />
                {/each}
            </div>
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
    #actor-details-block {
        display: flex;
        padding: 20px;
    }
    #actor-details-block > :global(div#actor-details) {
        width: 40%;
    }
    #movies-block {     
        width: 60%;
        overflow-x: hidden;
    }
    #title {
        font-family: 'Bungee Inline', cursive;
        text-align: center;
        color: black;
        font-size: 2.5rem;
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-weight: 500;
        line-height: 1.2;
    }
    #movies {
        display: flex;

        overflow-x: scroll;
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        /* border: 1px solid rgba(0,0,0,.125); */
        border-radius: 20px;
        box-shadow: 10px 5px 5px grey;
        padding: 10px;
        margin-left: 20px;
    }
    #movies::-webkit-scrollbar {
            width: 15px;
            background-color: #F5F5F5;
        } 
    #movies::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background: radial-gradient(#d4d4d4, rgba(27.45%, 22.75%, 19.22%, 0.88));
        box-shadow: 1px 1px 12px #555;
    } 
    #movies::-webkit-scrollbar-track {
        border-radius: 10px;
        box-shadow: none;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
    } 
</style>