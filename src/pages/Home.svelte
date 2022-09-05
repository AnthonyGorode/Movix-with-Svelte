<script lang="ts">
    import { onMount } from "svelte";
	import { fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
    
    import Spinner from "../components/Spinner.svelte";
    import Movie from "../components/Movie.svelte";
    import MovieDescription from "../components/MovieDescription.svelte";
    import SelectorMedia from "../components/SelectorMedia.svelte";

    import {
        getMediaDiscover,
        getMediaMarvel,
        getMediaTrending
    } from "../services/movieDb";

    let loadingDatas: boolean = false;

    let datasDiscover: {movie: any[], tv: any[]} = {movie: [], tv: []};
    let datasMarvel: {movie: any[], tv: any[]} = {movie: [], tv: []};
    let datasTrending: {movie: any[], tv: any[]} = {movie: [], tv: []};

    let keyMediaDiscover: string = "movie";
    let keyMediaMarvel: string = "movie";
    let keyMediaTrending: string = "movie";
    let firstMovie;

    let timeDiscover: boolean = false;
    let timeMarvel: boolean = false;
    let timeTrending: boolean = false;

    onMount(async() => {
        await fetchMovies();
	});

    const fetchMovies = async() => {
        try {
            datasDiscover.movie = await getMediaDiscover("movie");
            datasMarvel.movie = await getMediaMarvel("movie");
            datasTrending.movie = await getMediaTrending("movie");
            
            datasTrending.movie.sort((a,b) => b.vote_average - a.vote_average);

            loadingDatas = true;

            setTimeout(async() => timeDiscover = true, 1000);
            setTimeout(async() => firstMovie = datasDiscover.movie.find(movie => movie.id == "616037"), 2000);
            setTimeout(async() => timeMarvel = true, 3000);
            setTimeout(async() => timeTrending = true, 6000);
        } catch (error) {
            loadingDatas = true;
            console.error(error);
        }
    }

    const switchMedia = async(media: "movie" | "tv", type: string = "") => {
        switch(type) {
            case "discover":
                timeDiscover = false;
                if(!datasDiscover[media].length) {
                    datasDiscover[media] = await getMediaDiscover(media);
                    // datas[type][media].sort((a,b) => b.vote_average - a.vote_average);
                }
                keyMediaDiscover = media;
                setTimeout(() => {
                    datasDiscover[media] = datasDiscover[media];
                    timeDiscover = true;
                },1800);
                break;

            case "marvel":
                timeMarvel = false;
                if(!datasMarvel[media].length) {
                    datasMarvel[media] = await getMediaMarvel(media);
                }
                keyMediaMarvel = media;
                setTimeout(() => {
                    datasMarvel[media] = datasMarvel[media];
                    timeMarvel = true;
                },1800);
                break;

            case "trending":
                timeTrending = false;
                if(!datasTrending[media].length) {
                    datasTrending[media] = await getMediaTrending(media);
                }
                keyMediaTrending = media;
                
                setTimeout(() => {
                    datasTrending[media] = datasTrending[media];
                    timeTrending = true;
                },1800);
                break;
        }
    }

</script>
{#if loadingDatas}
    {#if firstMovie}    
        <MovieDescription movie={firstMovie} />
    {/if}
    <div class="title_container" out:scale={{delay: 200}}>
        <h2 class="title_block" style="margin-top: 20px;"> À découvrir </h2>
        <SelectorMedia keyMedia={keyMediaDiscover} typeMedia="discover" switchMedia={switchMedia} />
    </div>
    <div id="discover" out:scale={{delay: 200}}>
    {#if datasDiscover[keyMediaDiscover] && timeDiscover}
        {#each datasDiscover[keyMediaDiscover] as {poster_path, id, title}, index ({poster_path, id, title})}
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

    <div class="title_container" out:scale={{delay: 200}}>
        <h2 class="title_block">Best Marvel</h2>
        <SelectorMedia keyMedia={keyMediaMarvel} typeMedia="marvel" switchMedia={switchMedia} />
    </div>
    <div id="marvel" out:scale={{delay: 200}}>
    {#if datasMarvel[keyMediaMarvel] && timeMarvel}    
        {#each datasMarvel[keyMediaMarvel] as {poster_path, id, title}, index ({poster_path, id, title})}
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

    <div class="title_container" out:scale={{delay: 200}}>
        <h2 class="title_block">Tendances</h2>
        <SelectorMedia keyMedia={keyMediaTrending} typeMedia="trending" switchMedia={switchMedia} />
    </div>
    <div id="trending" out:scale={{delay: 200}}>
    {#if datasTrending[keyMediaTrending] && timeTrending}   
        {#each datasTrending[keyMediaTrending] as {poster_path, id, title}, index ({poster_path, id, title})}
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

