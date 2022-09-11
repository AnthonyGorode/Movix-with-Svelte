<script lang="ts">
	import { fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
    import { Input } from "sveltestrap";

    import { innerWidthStore } from "../hooks/viewport.hook";
    
    import Spinner from "../components/Spinner.svelte";
    import Movie from "../components/Movie.svelte";
    
    import { getMediaByQuery } from "../services/movieDb";

    let loadingDatas: boolean = false;
    let datas: {movie: any[], tv: any[]};

    let timeMovie: boolean = false;
    let timeTv: boolean = false;

    let query: string;

    // onMount(async() => {

    // });

    const searchMedia = async() => {
        loadingDatas = true;
        if(query) {
            datas = {
                movie: await getMediaByQuery(query, "movie"),
                tv: await getMediaByQuery(query, "tv")
            };
        } else {
            datas = {
                movie: [],
                tv: []
            }
        }
        loadingDatas = false;

        setTimeout(() => timeMovie = true, 1000);
        setTimeout(() => timeTv = true, 3000);
    }
</script>

<form on:submit|preventDefault={searchMedia} out:scale={{delay: 200}}>
    <div id="search-input">
        <Input
            type="search"
            name="search"
            id="search media"
            placeholder="Rechercher films ou séries"
            bind:value={query}
        />
        <button>
            <img src="/images/logo-search.png" alt="search logo">
        </button>
    </div>
</form>

<hr out:scale={{delay: 200}}>

{#if loadingDatas}     
    <div class="loading">
        <img src="/images/loading_new.gif" alt="loading gif" >
    </div>
{:else}

    {#if datas}
        {#if datas.movie.length}
            <h2 class="title_block" style="margin-top: 20px;" out:scale={{delay: 200}}> Films </h2>
            <div id="movie" out:scale={{delay: 200}}>
                {#if timeMovie}   
                    {#each datas.movie as {poster_path, id, title}, index ({poster_path, id, title})}
                        <div class="child_component_block" transition:fly={{ y: -60 }} animate:flip={{ delay:150, duration:500 }}>   
                            <Movie poster_path={poster_path} id={id} media="movie" title={title} />
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
        {/if}

        {#if datas.tv.length}
            <h2 class="title_block" style="margin-top: 20px;" out:scale={{delay: 200}}> Séries TV </h2>
            <div id="tv" out:scale={{delay: 200}}>
                {#if timeTv}   
                    {#each datas.tv as {poster_path, id, title}, index ({poster_path, id, title})}
                        <div class="child_component_block" transition:fly={{ y: -60 }} animate:flip={{ delay:150, duration:500 }}>   
                            <Movie poster_path={poster_path} id={id} media="tv" title={title} />
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
        {/if}

        {#if !datas.movie.length && !datas.tv.length}
            <h3 id="no-element-content">Aucun élément ne correspond à votre recherche.</h3>
        {/if}
    {/if}
    
{/if}

<style>
    #search-input {
        display: flex;
        width: 50%;
        margin-top: 40px;
        margin-top: 40px;
        margin-left: auto;
        margin-right: auto;
    }
    @media (max-width: 600px) {
            #search-input {
            width: unset;
        }
    }
    
    @media (max-width: 300px) {
        button img {
            width: 18px!important;
        }
    }
    #search-input :global(input) {
        border-radius: 0.375rem 0 0 0.375rem;
    }
    button {
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border: 1px solid #00000033;
        border-radius: 0 10px 10px 0;
        padding: 5px;
        color: white;
        width: 10%;
    }
    button img {
        width: 30px;
    }
    button:hover > img {
        animation-duration: 1s;
        animation-timing-function:cubic-bezier(0.075, 0.82, 0.165, 1);
        animation-delay: 0s;
        animation-iteration-count: 1;
        animation-direction: normal;
        animation-fill-mode: both;
        animation-play-state: running;
        animation-name: rotatein;
    }
    button:not(:hover) > img {
        animation-duration: 1s;
        animation-timing-function:cubic-bezier(0.075, 0.82, 0.165, 1);
        animation-delay: 0s;
        animation-iteration-count: 1;
        animation-direction: normal;
        animation-fill-mode: both;
        animation-play-state: running;
        animation-name: rotateout;
    }
    @keyframes rotatein {
        100% {
            transform: rotate(-90deg);
        }
    }
    @keyframes rotateout {
        0% {
            transform: rotate(-90deg);
        }
        100% {
            transform: rotate(0deg);
        }
    }


    button:hover {
        background-color: rgba(20.45%, 22.75%, 19.22%, 0.88);
    }

    #no-element-content {
        text-align: center;
        font-family: serif;
    }

    #movie, #tv {
        display: flex;

        overflow-x: scroll;
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border: 1px solid rgba(0,0,0,.125);
        border-radius: 20px;
        box-shadow: 10px 5px 5px grey;
        padding: 10px;
        margin: 10px;
        height: 411px;
    }
    #movie::-webkit-scrollbar, #tv::-webkit-scrollbar {
        width: 15px;
        background-color: #F5F5F5;
    }
    #movie::-webkit-scrollbar-thumb, #tv::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background: radial-gradient(#d4d4d4, rgba(27.45%, 22.75%, 19.22%, 0.88));
        box-shadow: 1px 1px 12px #555;
    }
    #movie::-webkit-scrollbar-track, #tv::-webkit-scrollbar-track {
        border-radius: 10px;
        box-shadow: none;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
    }
</style>