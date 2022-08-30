<script lang="ts">
    import Spinner from "../components/Spinner.svelte";
    import { onMount } from "svelte";

    import Movie from "../components/Movie.svelte";
    import MovieDescription from "../components/MovieDescription.svelte";

    import {
        getMoviesDiscover,
        getMoviesMarvel,
        getMovieTrending
    } from "../services/movieDb";

    let datas;
    let firstMovie;

    let timeDiscover: boolean = false,
    timeMarvel: boolean = false,
    timeTrending: boolean = false;

    onMount(async() => {
		datas = await fetchMovies();
        if(datas) firstMovie = datas.trending[0];

        setTimeout(() => timeDiscover = true, 1000);
        setTimeout(() => timeMarvel = true, 4000);
        setTimeout(() => timeTrending = true, 7000);
        console.log(datas);
        datas = datas;
	});

    const fetchMovies = async() => {
        const discover = await getMoviesDiscover();
        const marvel = await getMoviesMarvel();
        const trending = await getMovieTrending();
        let datas = {
            discover,
            marvel,
            trending
        };

        return datas;
    }

</script>
{#if datas}
    {#if firstMovie}    
        <MovieDescription movie={firstMovie} />
    {/if}

    <h1 class="title_block" style="margin-top: 20px;"> Les films à découvrir </h1>
    <div id="discover">
    {#if datas && timeDiscover}
        {#each datas.discover as {poster_path, id}}    
            <Movie poster_path={poster_path} id={id} />
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

    <h1 class="title_block">Best films Marvel</h1>
    <div id="marvel">
    {#if datas && timeMarvel}    
        {#each datas.marvel as {poster_path, id}}    
            <Movie poster_path={poster_path} id={id} />
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

    <!-- <h1>Les meilleurs films DC</h1>
    <div id="dc">
    {#if datas}    
        {#each datas.dc as {poster_path, id}}    
            <Movie poster_path={poster_path} id={id} />
        {/each}

    {:else}
        <p>Loading . . .</p>
    {/if}
    </div> -->

    <h1 class="title_block">Tendances</h1>
    <div id="trending">
    {#if datas && timeTrending}    
        {#each datas.trending as {poster_path, id}}    
            <Movie poster_path={poster_path} id={id} />
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

<!-- <h1>Science Fiction du moment</h1>
<div id="scifi">
    {#if datas}    
        {#each datas.scifi as {poster_path, id}}    
            <Movie poster_path={poster_path} id={id} />
        {/each}

    {:else}
        <p>Loading . . .</p>
    {/if}
</div> -->

<!-- <h1>Best Dramas</h1>
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
    #discover, #marvel, #trending {
        display: flex;

        overflow-x: scroll;
        background-color: rgba(27.45%, 22.75%, 19.22%, 0.88);
        border: 1px solid rgba(0,0,0,.125);
        border-radius: 20px;
        box-shadow: 10px 5px 5px grey;
        padding: 10px;
        margin: 10px;
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

