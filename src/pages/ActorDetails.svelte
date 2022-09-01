<script lang="ts">
    import { onMount } from "svelte";    
    import { navigate } from "svelte-navigator";
    import { fly, scale } from 'svelte/transition';

    import ActorCard from "../components/ActorCard.svelte";
    import Movie from "../components/Movie.svelte";
    import Spinner from "../components/Spinner.svelte";
    import ReturnButton from "../components/ReturnButton.svelte";

    import {
        getActorDetails,
        getMoviesActor
    } from "../services/movieDb";

    import { 
        addActor,
        getActorById,
        deleteActor
    } from "../services/actorRepo";

    import type ActorModel from "../models/actor.model";

    export let params;
    const { id } = params;
    
    let actorDatas;

    let isGetDocumentId: boolean = false;
    let isFavorite: boolean = false;

    let documentId: string; // document ID of movie added on firebase

    let previous_page = localStorage.getItem("previous_page");

    onMount(async() => {
        if(id) await fetchActorDetails(id);
        else navigate("/home", { replace: true });

        if(actorDatas) {
            console.log(actorDatas.details);
            console.log(actorDatas.movies);
        }
        
        await getFavorisId();
        actorDatas = actorDatas;
    });

    const fetchActorDetails = async(idActor: number) => {
        actorDatas = {
            details: await getActorDetails(idActor), // {}
            movies: await getMoviesActor(idActor) // []
        }
    }

    const getFavorisId = async() => {
        if(actorDatas.details) {
            documentId = await getActorById(actorDatas.details.id); // check if actor added in firebase and get docId
            if(documentId) {
                isFavorite = true;
            }
            isGetDocumentId = true;
        }
    }

    const addActorToFavorite = async() => {
        const { 
            id, name, also_known_as, birthday, deathday, place_of_birth, gender, biography, popularity, profile_path
        } = actorDatas.details;

        const movie: ActorModel = { id, name, also_known_as, birthday, deathday, place_of_birth, gender, biography, popularity, profile_path };
        
        try {
           documentId = await addActor(movie);
           isFavorite = true;
        } catch (error) {
            console.error(error);
        }
    }

    const deleteActorToFavorite = async(doc_id: string) => {
        try {
            await deleteActor(doc_id);
            isFavorite = false;
        } catch (error) {
            console.error(error);
        }
    }

    const returnPreviousPage = () => {
        const page = localStorage.getItem("previous_page");
        const id = localStorage.getItem("movie_id");

        localStorage.clear();
        navigate(`/${page}/${id}`, { replace: true });
    }
</script>


{#if actorDatas}
    {#if previous_page}
    <div id="block-return-btn">
        <ReturnButton returnPreviousPage={returnPreviousPage} />
    </div>
    {/if}
    <div id="actor-details-block">
        <ActorCard 
            actorDetails={actorDatas.details}
            isGetDocumentId={isGetDocumentId}
            paramsFavoriteBtn={{documentId, isFavorite, addActorToFavorite, deleteActorToFavorite}}
        />
        <div id="movies-block" in:fly="{{ y: 100, duration: 1000 }}" out:scale={{delay: 200}}>
            <div id="title">Filmographie</div>
            <div id="movies">
                {#each actorDatas.movies as {poster_path, id, title}} 
                    <Movie poster_path={poster_path} id={id} title={title} />
                {/each}
            </div>

            <!-- <div id="title">Séries</div>
            <div id="movies">
                {#each actorDatas.movies as {poster_path, id, title}} 
                    <Movie poster_path={poster_path} id={id} title={title} />
                {/each}
            </div> -->
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
    #block-return-btn > :global(div#return-button) {       
        bottom: 0px;
    }
    #actor-details-block {
        display: flex;
        padding: 20px;
    }
    #actor-details-block > :global(div#actor-details) {
        width: 40%;
        height: 100%;
    }
    #movies-block {     
        width: 60%;
        overflow-x: hidden;
    }
    #title {
        font-family: 'Bungee Inline', cursive;
        text-align: center;
        color: rgba(27.45%, 22.75%, 19.22%, 0.88);
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