<script lang="ts">
    import { onMount } from "svelte";
	import { fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
    
    import Spinner from "../components/Spinner.svelte";
    import Movie from "../components/Movie.svelte";
    import MovieDescription from "../components/MovieDescription.svelte";

    import {
        getMediaDiscover,
        getMediaMarvel,
        getMediaTrending
    } from "../services/movieDb";

    let datas: {[key:string]: {movie: any[], tv: any[]}} = { 
        discover: {
            movie: null,
            tv: null
        },
        marvel: {
            movie: null,
            tv: null
        },
        trending: {
            movie: null,
            tv: null
        } 
    };
    let keyMediaDiscover: string = "movie";
    let keyMediaMarvel: string = "movie";
    let keyMediaTrending: string = "movie";
    let firstMovie;

    let time: {[key: string]: boolean} = {
        discover: false,
        marvel: false,
        trending: false
    }

    onMount(async() => {
        await fetchMovies();

        console.log(datas);
        datas = datas;
	});

    const fetchMovies = async() => {
        datas.discover.movie = await getMediaDiscover("movie");
        datas.marvel.movie = await getMediaMarvel("movie");
        datas.trending.movie = await getMediaTrending("movie");
        
        datas.trending.movie.sort((a,b) => b.vote_average - a.vote_average);

        setTimeout(async() => time.discover = true, 1000);
        setTimeout(async() => firstMovie = datas.discover.movie.find(movie => movie.id == "616037"), 2000);
        setTimeout(async() => time.marvel = true, 3000);
        setTimeout(async() => time.trending = true, 6000);
    }

    const switchMedia = async(type: string, media: "movie" | "tv") => {
        time[type] = false;
        switch(type) {
            case "discover":
                if(!datas[type][media]) {
                    datas[type][media] = await getMediaDiscover(media);
                    // datas[type][media].sort((a,b) => b.vote_average - a.vote_average);
                }
                keyMediaDiscover = media;
                break;

            case "marvel":
                if(datas[type][media]) {
                    datas[type][media] = await getMediaMarvel("tv");
                }
                keyMediaMarvel = media;
                break;

            case "trending":
                if(datas[type][media]) {
                    datas[type][media] = await getMediaTrending("tv");
                }
                keyMediaTrending = media;
                break;
        }
        setTimeout(() => {
            datas[type][media] = datas[type][media];
            time[type] = true;
        },1800);
    }

</script>
{#if datas}
    {#if firstMovie}    
        <MovieDescription movie={firstMovie} />
    {/if}
    <div class="title_container">
        <h2 class="title_block" style="margin-top: 20px;"> À découvrir </h2>
        <div class="selector">
            <h3 class="{keyMediaDiscover == 'movie' ? 'switch_active' : '' }" on:click={() => switchMedia("discover", "movie")}>Films</h3>
            <h3 class="{keyMediaDiscover == 'tv' ? 'switch_active' : '' }" on:click={() => switchMedia("discover", "tv")}>Séries</h3>
        </div>
    </div>
    <div id="discover" out:scale={{delay: 200}}>
    {#if datas.discover && time.discover}
        {#each datas.discover[keyMediaDiscover] as {poster_path, id, title}, index ({poster_path, id, title})}
            <div class="child_component_block" transition:fly={{ y: -60 }} animate:flip={{ delay:150, duration:500 }}>
                <Movie poster_path={poster_path} id={id} media={keyMediaDiscover} title={title} />
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

    <h2 class="title_block">Best Marvel</h2>
    <div id="marvel" out:scale={{delay: 200}}>
    {#if datas.marvel && time.marvel}    
        {#each datas.marvel[keyMediaMarvel] as {poster_path, id, title}, index ({poster_path, id, title})}
            <div class="child_component_block" transition:fly={{ y: -60 }} animate:flip={{ delay:150, duration:500 }}>   
                <Movie poster_path={poster_path} id={id} media={keyMediaMarvel} title={title} />
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

    <h2 class="title_block">Tendances</h2>
    <div id="trending" out:scale={{delay: 200}}>
    {#if datas.trending && time.trending}   
        {#each datas.trending[keyMediaTrending] as {poster_path, id, title}, index ({poster_path, id, title})}
            <div class="child_component_block" transition:fly={{ y: -60 }} animate:flip={{ delay:150, duration:500 }}>   
                <Movie poster_path={poster_path} id={id} media={keyMediaTrending} title={title} />
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

<!-- <h2>Les meilleurs films DC</h2>
<div id="dc">
    {#if datas}    
        {#each datas.dc as {poster_path, id}}    
            <Movie poster_path={poster_path} id={id} />
        {/each}

    {:else}
        <p>Loading . . .</p>
    {/if}
</div> -->

<!-- <h2>Science Fiction du moment</h2>
<div id="scifi">
    {#if datas}    
        {#each datas.scifi as {poster_path, id}}    
            <Movie poster_path={poster_path} id={id} />
        {/each}

    {:else}
        <p>Loading . . .</p>
    {/if}
</div> -->

<!-- <h2>Best Dramas</h2>
<div id="dramas">
    {#if datas}    
        {#each datas.drama as {poster_path, id}}    
            <Movie poster_path={poster_path} id={id} />
        {/each}

    {:else}
        <p>Loading . . .</p>
    {/if}
</div> -->

<style>
    .title_container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
    }
    .selector {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        align-content: center;
        border: 1px solid rgba(3,37,65, 1);
        border-radius: 30px;
        margin-left: 20px;
    }
    .selector h3 {
        padding: 4px 20px;
        margin-bottom: unset;
        font-size: 16px;
        cursor: pointer;
    }
    .switch_active {
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border-radius: 30px;
        color: white;
    }
    #discover, #marvel, #trending {
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
    #discover::-webkit-scrollbar,
    #marvel::-webkit-scrollbar,
    #trending::-webkit-scrollbar {
        width: 15px;
        background-color: #F5F5F5;
    } 
    #discover::-webkit-scrollbar-thumb, 
    #marvel::-webkit-scrollbar-thumb, 
    #trending::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background: radial-gradient(#d4d4d4, rgba(27.45%, 22.75%, 19.22%, 0.88));
        box-shadow: 1px 1px 12px #555;
    } 
    #discover::-webkit-scrollbar-track, 
    #marvel::-webkit-scrollbar-track,
    #trending::-webkit-scrollbar-track {
        border-radius: 10px;
        box-shadow: none;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
    }
</style>

