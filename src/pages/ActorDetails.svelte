<script lang="ts">
    import { onMount } from "svelte";    
    import { navigate } from "svelte-navigator";
    import { fly, scale } from 'svelte/transition';

    import ActorCard from "../components/ActorCard.svelte";
    import Movie from "../components/Movie.svelte";
    import Spinner from "../components/Spinner.svelte";
    import ReturnButton from "../components/ReturnButton.svelte";

    import { authStore } from "../hooks/auth.hook";

    import {
        getActorDetails,
        getAllMediaActor
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

    let timeMovies: boolean = false;
    let timeSeries: boolean = false;

    let isGetDocumentId: boolean = false;
    let isFavorite: boolean = false;

    let documentId: string; // document ID of movie added on firebase

    let previous_page = localStorage.getItem("previous_page");

    let uid: string; // uid of authenticate user

    onMount(async() => {
        uid = $authStore.uid;
        
        if(id) await fetchActorDetails(id);
        else navigate("/home", { replace: true });

        setTimeout(() => timeMovies = true, 1500);
        setTimeout(() => timeSeries = true, 3000);
        
        await getFavorisId();
        actorDatas = actorDatas;
    });

    const fetchActorDetails = async(idActor: number) => {
        actorDatas = {
            details: await getActorDetails(idActor), // {}
            movies: await getAllMediaActor(idActor, "movie"), // []
            series: []
        }
        const series = await getAllMediaActor(idActor, "tv");
        let arrayToFilter: any[] = [];
        if(series.cast.length > 20) {
            for(let i = 0; i < 20; i++) {
                arrayToFilter.push(series.cast[i]);
            }
        } else {
            arrayToFilter = series.cast;
        }
        actorDatas.series = filterDuplicateElement(arrayToFilter);
        actorDatas.series.sort((a,b) => b.popularity - a.popularity); 
    }

    const filterDuplicateElement = (arrayToFilter) => {
        var seen = {};
        let arrayFiltered = [];
        arrayToFilter.map(function(currentObject) {
            if (!seen.hasOwnProperty(currentObject.id.toString())) {
                // Current id is being seen for the first time              
                arrayFiltered.push(currentObject);
                seen[currentObject.id.toString()] = false;
            }
        });

        return arrayFiltered;
    }

    const getFavorisId = async() => {
        if(actorDatas.details) {
            documentId = await getActorById(actorDatas.details.id, uid); // check if actor added in firebase and get docId
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
           documentId = await addActor(movie, uid);
           isFavorite = true;
        } catch (error) {
            console.error(error);
        }
    }

    const deleteActorToFavorite = async(doc_id: string) => {
        try {
            await deleteActor(doc_id, uid);
            isFavorite = false;
        } catch (error) {
            console.error(error);
        }
    }

    const returnPreviousPage = () => {
        const page = localStorage.getItem("previous_page");
        const id = localStorage.getItem("media_id");

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
        <div id="media-block" in:fly="{{ y: 100, duration: 1000 }}" out:scale={{delay: 200}}>
            <div id="title-movies">Filmographie</div>
            <div id="movies">
                {#if actorDatas.movies && timeMovies}    
                    {#each actorDatas.movies as {poster_path, id, title}} 
                        <Movie poster_path={poster_path} id={id} title={title} media="movie" />
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

            <div id="title-series">Séries TV</div>
            <div id="series">
                {#if actorDatas.series && timeSeries}
                    {#each actorDatas.series as {poster_path, id, title}} 
                        <Movie poster_path={poster_path} id={id} title={title} media="tv" />
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
    </div>
{:else}
    <div class="main_spinner">
        <img src="/images/loading_new.gif" alt="loading gif" >
    </div>
{/if}

<style>
    @media (max-width: 600px) and (max-width: 950px) {
        #actor-details-block {
            flex-direction: column;
            padding: unset!important;
        }     
        #media-block {
            width: unset!important;
        }
        #movies, #series {
            margin: 5px!important;
        }
    }
    @media (max-width: 1100px) {
        #actor-details-block {
            flex-direction: column;
            padding: unset!important;
        }     
        #media-block {
            width: unset!important;
        }
        #movies, #series {
            margin: 5px!important;
        }
    }
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
    #media-block {     
        width: 60%;
        overflow-x: hidden;
    }
    #title-movies, #title-series {
        font-family: 'Bungee Inline', cursive;
        text-align: center;
        color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        font-size: 2.5rem;
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-weight: 500;
        line-height: 1.2;
    }
    #title-series {
        margin-top: 10px;
    }
    #movies, #series {
        display: flex;

        overflow-x: scroll;
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border-radius: 20px;
        box-shadow: 10px 5px 5px grey;
        padding: 10px;
        margin-left: 20px;
    }
    #movies::-webkit-scrollbar, #series::-webkit-scrollbar {
            width: 15px;
            background-color: #F5F5F5;
        } 
    #movies::-webkit-scrollbar-thumb, #series::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background: radial-gradient(#d4d4d4, rgba(27.45%, 22.75%, 19.22%, 0.88));
        box-shadow: 1px 1px 12px #555;
    } 
    #movies::-webkit-scrollbar-track, #series::-webkit-scrollbar-track {
        border-radius: 10px;
        box-shadow: none;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
    } 
</style>